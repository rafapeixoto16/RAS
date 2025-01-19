import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as OTPAuth from 'otpauth';
import sendEmail from '../email/sendEmail.js';
import crypto from 'node:crypto';
import path from 'node:path';
import mongoose from 'mongoose';

import * as User from '../controller/user.js';
import multer from '../config/multerConfig.js';
import minioClient from '../config/minioClient.js';
import { schemaValidation, validateRequest } from '@picturas/schema-validation';
import { requiresAuth, requiresNonGuest } from '@picturas/ms-helper';

const SALT_WORK_FACTOR = 10;

const router = Router();

const kinds = {
    resetPassword: 'resetPassword',
    validateAccount: 'validateAccount',
    login2phase: 'login2phase',
};

const issuer = 'Picturas - Stolen from UMinho Students Work';

export const objectIdSchema = schemaValidation.string().refine((val) => mongoose.Types.ObjectId.isValid(val));

router.post('/register', validateRequest({
    body: schemaValidation.object({
        name: schemaValidation.string(),
        email: schemaValidation.string().email(),
        password: schemaValidation.string(),
        username: schemaValidation.string(),
        userId: objectIdSchema.optional()
    }),
}), async (req, res) => {
    if (req.body.name === 'Rick Astley') console.log('Never Gonna Give You Up');

    req.body.password = await bcrypt.hash(req.body.password, SALT_WORK_FACTOR);

    const { userId, ...createUser } = req.body;

    if (userId) createUser._id = req.body.userId;

    User.addUser(createUser)
        .then((user) => {
            const filteredUser = {
                _id: user._id,
                kind: kinds.validateAccount,
                migrateAccount: !!req.body.userId
            };

            const validationToken = jwt.sign(
                filteredUser,
                process.env.VALIDATE_JWT_SECRET,
                {expiresIn: '24h'}
            );

            sendEmail(user.email, validationToken, kinds.validateAccount);
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(444).json({error: 'Failed to add user'});
        });
});

router.post('/register/2', validateRequest({
    body: schemaValidation.object({
        validationToken: schemaValidation.string()
    }),
}), async (req, res) => {
    jwt.verify(
        req.body.validationToken,
        process.env.VALIDATE_JWT_SECRET,
        (err, user) => {
            if (err || user.kind !== kinds.validateAccount) {
                res.status(404).json({
                    error: 'Time limit to activate account exceeded',
                });
                return;
            }

            User.getUser(user._id)
                .then(async (resp) => {
                    const filteredUser = {
                        ...resp._doc,
                        active: true,
                        expireAt: null
                    };

                    await User.updateUser(user._id, filteredUser);
                    if (user.migrateAccount)
                        await axios.delete(`http://${process.env.PROJECTS_MS}:${process.env.PROJECTS_MS_PORT}/private/migrateAccount`, {
                            data: {
                                userId
                            }
                        });

                    res.status(200).send()
                }).catch((_) => {
                res.status(404).json({
                    error: 'Failed to active user account',
                });
            });
        }
    );
});

router.post('/login', validateRequest({
    body: schemaValidation.object({
        email: schemaValidation.string().email(),
        password: schemaValidation.string()
    }),
}), async (req, res) => {
    try {
        const userDoc = await User.getUserByEmail(req.body.email);

        if (!userDoc) {
            return res.status(400).send('Cannot find user');
        }

        const user = userDoc._doc;

        if (!user.active) {
            return res.status(401).send('User must be validated first');
        }

        if (await bcrypt.compare(req.body.password, user.password)) {
            const filteredUser = {
                _id: user._id,
                kind: kinds.login2phase,
            };

            const validationToken = jwt.sign(
                filteredUser,
                process.env.VALIDATE_JWT_SECRET,
                {expiresIn: '15m'}
            );

            res.status(200).json({
                validationToken,
                requiresOtp: user.otpEnabled,
            });
        } else {
            res.status(555).json({error: 'Invalid Password'});
        }
    } catch {
        res.status(445).send();
    }
});

router.post('/login/2', validateRequest({
    body: schemaValidation.object({
        validationToken: schemaValidation.string(),
        code: schemaValidation.string().length(6).regex(/^\d+$/).optional()
    }),
}), async (req, res) => {
    jwt.verify(
        req.body.validationToken,
        process.env.VALIDATE_JWT_SECRET,
        async (err, user) => {
            if (err) return res.sendStatus(403);
            if (user.kind !== kinds.login2phase) return res.sendStatus(403);

            const userInfoData = await User.getUser(user._id);

            if (!userInfoData) res.sendStatus(441);

            const userInfo = userInfoData._doc;

            if (userInfo.otpEnabled) {
                if (!req.body.code) return res.sendStatus(482);

                const totp = new OTPAuth.TOTP({
                    issuer,
                    label: userInfo.username,
                    algorithm: 'SHA1',
                    digits: 6,
                    period: 30,
                    secret: OTPAuth.Secret.fromBase32(userInfo.otpSecret),
                });
                const val = totp.validate({
                    token: req.body.code,
                    window: 1,
                });

                if (val == null) return res.sendStatus(401);
            }

            const iat = Math.floor(Date.now() / 1000);

            const filteredUser = {
                isGuest: false,
                _id: user._id,
                username: user.username,
                email: user.email,
                iat
            };

            const accessToken = jwt.sign(
                filteredUser,
                process.env.AUTH_JWT_SECRET,
                {expiresIn: '15m'}
            );

            const randomBytes = crypto.randomBytes(16).toString('hex');
            filteredUser.accessId = randomBytes;
            const refreshToken = jwt.sign(
                filteredUser,
                process.env.REFRESH_JWT_SECRET
            );
            user.refresh = randomBytes;

            User.updateUser(user._id, user)
                .then((_) =>
                    res.json({
                        accessToken,
                        refreshToken,
                    })
                )
                .catch((_) => res.status(447));
        }
    );
});

router.post('/guestLogin', (req, res) => {
    const filteredUser = {
        isGuest: true,
        _id: new mongoose.Types.ObjectId(),
        username: null,
        email: null,
        iat: Math.floor(Date.now() / 1000)
    };

    const accessToken = jwt.sign(
        filteredUser,
        process.env.AUTH_JWT_SECRET,
        {expiresIn: '24h'}
    );

    res.json({
        accessToken,
    });
});

router.post('/passwordRecovery', validateRequest({
    body: schemaValidation.object({
        email: schemaValidation.string().email()
    }),
}), (req, res) => {
    User.getUserByEmail(req.body.email)
        .then((user) => {
            if (!user) return res.sendStatus(404);
            if (!user.active) res.sendStatus(401);

            const filteredUser = {
                _id: user._id,
                kind: kinds.resetPassword,
            };

            const validationToken = jwt.sign(
                filteredUser,
                process.env.VALIDATE_JWT_SECRET,
                {expiresIn: '24h'}
            );

            sendEmail(user.email, validationToken, kinds.resetPassword);
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(404).json({error: 'Failed to find the user'});
        });
});

router.post('/passwordRecovery/2', validateRequest({
    body: schemaValidation.object({
        validationToken: schemaValidation.string()
    }),
}), (req, res) => {
    jwt.verify(
        req.body.validationToken,
        process.env.VALIDATE_JWT_SECRET,
        (err, user) => {
            if (err || user.kind !== kinds.resetPassword) {
                res.status(404).json({
                    error: 'Time limit to activate account exceeded',
                });
                return;
            }

            User.getUser(user._id)
                .then(async (resp) => {
                    if (!resp) return res.sendStatus(404);

                    const filteredUser = {
                        ...resp._doc,
                        password: await bcrypt.hash(req.body.password, SALT_WORK_FACTOR),
                    };

                    await User.updateUser(user._id, filteredUser);

                    res.status(200).send()
                }).catch((_) => {
                res.status(404).json({
                    error: 'Failed to active user account',
                });
            });
        }
    );
});

router.post('/token', validateRequest({
    body: schemaValidation.object({
        refreshToken: schemaValidation.string()
    }),
}), (req, res) => {
    jwt.verify(req.body.refreshToken, process.env.REFRESH_JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        const userInfo = await User.getUser(user._id);

        if (!userInfo) return res.sendStatus(404);

        if (user.accessId !== userInfo.refresh) {
            res.sendStatus(401);
            return;
        }

        const filteredUser = {
            _id: userInfo._id,
            username: userInfo.username,
            email: userInfo.email,
        };

        const accessToken = jwt.sign(filteredUser, process.env.AUTH_JWT_SECRET, {
            expiresIn: '15m',
        });
        res.json({accessToken}).send();
    });
});

// Requires Auth from now on
router.use(requiresAuth);
router.use(requiresNonGuest);

router.delete('/logout', async (req, res) => {
    User.getUser(req.user._id).then(userInfo => {
        if (!userInfo) return res.sendStatus(404);

        userInfo.refresh = null;

        User.updateUser(userInfo._id, userInfo)
            .then((resp) => res.sendStatus(200))
            .catch((err) => res.sendStatus(400));
    })
        .catch((err) => res.sendStatus(400));
});

router.put('/profilePic', multer.single('profilePic'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
    }

    const extensionName = path.extname(req.file.originalname);
    const profilePicName = `${req.user._id}${extensionName}`;

    const metaData = {
        'Content-Type': req.file.mimetype,
    };

    minioClient.putObject(
        process.env.S3_PROFILE_PICTURE_BUCKET,
        profilePicName,
        req.file.buffer,
        metaData,
        (err, etag) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        error: 'Failed to upload image to MinIO',
                        details: err,
                    });
            }

            // TODO unnecessary
            const imageUrl = `${process.env.S3_PROFILE_PICTURE_BUCKET}/${profilePicName}`;

            User.updateUserProfilePic(req.user._id, imageUrl)
                .then(() =>
                    res
                        .status(200)
                        .json({
                            message: 'Profile picture updated successfully',
                            imageUrl,
                        })
                )
                .catch((err) => {
                        res
                            .status(500)
                            .json({
                                error: 'Failed to update user profile picture',
                                details: err,
                            })
                    }
                );
        }
    );
});

router.get('/', (req, res) => {
    User.getUser(req.user._id)
        .then((resp) => {
            if (!resp) return res.sendStatus(404);

            const filteredUser = {
                username: resp.username,
                email: resp.email,
                location: resp.location,
                bio: resp.bio,
                name: resp.name,
                profilePic: resp.profilePic,
                emailPreferences: resp.emailPreferences
            };

            res.status(200).json(filteredUser);
        })
        .catch((_) => res.sendStatus(466));
});

router.put(
    '/',
    validateRequest({
        body: schemaValidation.object({
            name: schemaValidation.string().min(1).optional(),
            location: schemaValidation.string().optional(),
            bio: schemaValidation.string().optional(),
        }),
    }),
    (req, res) => {
        User.updateUser(req.user._id, req.body)
            .then((_) => res.sendStatus(200))
            .catch((err) => res.sendStatus(447));
    }
);

router.put('/password',
    validateRequest({
        body: schemaValidation.object({
            password: schemaValidation.string(),
        }),
    }), async function (req, res) {
        User.updateUserPassword(req.user._id, await bcrypt.hash(req.body.password, SALT_WORK_FACTOR))
            .then((data) => res.sendStatus(201))
            .catch((_) => res.sendStatus(448));
    }
);

router.post('/otp', (req, res) => {
    User.getUser(req.user._id).then(userInfo => {
        if (!userInfo) return res.sendStatus(404);
        if (userInfo.otpEnabled) return res.sendStatus(401);

        const secret = new OTPAuth.Secret({size: 20});

        const totp = new OTPAuth.TOTP({
            issuer,
            label: userInfo.username,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret,
        });

        userInfo.otpEnabled = true;
        userInfo.otpSecret = secret.base32;

        User.updateUser(userInfo._id, userInfo)
            .then((_) => res.json({totp: totp.toString()}))
            .catch((_) => res.status(488).send());
    })
        .catch((_) => res.status(488).send());
});

router.delete('/otp', (req, res) => {
    User.getUser(req.user._id).then(userInfo => {
        if (!userInfo) return res.sendStatus(404);
        if (!userInfo.otpEnabled) return res.sendStatus(401);

        userInfo.otpEnabled = false;
        userInfo.otpSecret = null;

        User.updateUser(userInfo._id, userInfo)
            .then((_) => res.sendStatus(200))
            .catch((_) => res.sendStatus(447));
    })
        .catch((_) => res.sendStatus(447));
});

router.put(
    '/updateEmailPreferences',
    validateRequest({
        body: schemaValidation.object({
            projectUpdates: schemaValidation.boolean().optional(),
            newFeatures: schemaValidation.boolean().optional(),
            marketing: schemaValidation.boolean().optional(),
            projectCollaborations: schemaValidation.boolean().optional(),
            comments: schemaValidation.boolean().optional(),
        })
    }),
    async (req, res) => {
        try {
            const out = await User.updateUser(req.user._id, {emailPreferences: req.body});

            res.status(200).json({
                message: 'Email preferences updated successfully',
                emailPreferences: out.emailPreferences
            });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to update email preferences',
                details: error.message,
            });
        }
    }
);

router.delete('/deleteAccount', async (req, res) => {
    try {
        const userId = req.user._id;

        await axios.delete(`http://${process.env.SUBSCRIPTIONS_MS}:${process.env.SUBSCRIPTIONS_MS_PORT}/private/deleteAccout`, {
            data: {
                userId
            }
        });

        await axios.delete(`http://${process.env.PROJECTS_MS}:${process.env.PROJECTS_MS_PORT}/private/deleteAccout`, {
            data: {
                userId
            }
        });

        await User.deleteUser(userId);

        res.status(200).json({
            message: 'User deleted.',
            userId: userInfo._id
        });
    } catch (_) {
        res.sendStatus(500);
    }
});

export default router;
