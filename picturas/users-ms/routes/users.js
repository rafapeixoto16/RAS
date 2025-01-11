import {Router} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as OTPAuth from 'otpauth';
import sendEmail from '../email/sendEmail.js';
import crypto from 'node:crypto';

import * as User from '../controller/user.js';
import multer from '../config/multerConfig.js';
import minioClient from '../config/minioClient.js';
import {v4 as uuidv4} from 'uuid';
import {schemaValidation, validateRequest} from '@picturas/schema-validation';
import {getUserByEmail} from "../controller/user.js";

const BUCKET_NAME = 'bucket-name'; //TODO **TROCAR PELO bucket-name do MinIO**
const SALT_WORK_FACTOR = 10;

const router = Router();

const kinds = {
    resetPassword: 'resetPassword',
    validateAccount: 'validateAccount',
    login2phase: 'login2phase',
};

const issuer = 'Picturas - Stolen from UMinho Students Work';

router.post('/register', async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, SALT_WORK_FACTOR);

    User.addUser(req.body)
        .then((user) => {
            const filteredUser = {
                _id: user._id,
                kind: kinds.validateAccount,
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

router.post('/register/2', async (req, res) => {
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
                .then((resp) => {
                    const filteredUser = {
                        ...resp._doc,
                        active: true,
                        expireAt: null
                    };

                    User.updateUser(user._id, filteredUser);

                    res.status(200).send()
                }).catch((_) => {
                res.status(404).json({
                    error: 'Failed to active user account',
                });
            });
        }
    );
});

router.post('/login', async (req, res) => {
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

router.post('/login/2', async (req, res) => {
    jwt.verify(
        req.body.validationToken,
        process.env.VALIDATE_JWT_SECRET,
        async (err, user) => {
            console.error("SILVES 1")
            if (err) return res.sendStatus(403);
            if (user.kind !== kinds.login2phase) return res.sendStatus(403);

            const userInfoData = await User.getUser(user._id);

            if(!userInfoData) res.sendStatus(441);

            const userInfo = userInfoData._doc;

            if (userInfo.otpEnabled) {
                const totp = new OTPAuth.TOTP({
                    issuer,
                    label: userInfo.username,
                    algorithm: 'SHA1',
                    digits: 6,
                    period: 30,
                    secret: userInfo.otpSecret,
                });
                const val = totp.validate({
                    token: req.body.code,
                    window: 1,
                });

                if (val == null) return res.sendStatus(401);
            }

            const filteredUser = {
                _id: user._id,
                username: user.username,
                email: user.email,
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

router.post('/passwordRecovery', (req, res) => {
    User.getUserByEmail(req.body.email)
        .then((user) => {
            if (user.active) res.sendStatus(401);

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

router.post('/passwordRecovery/2', async (req, res) => {
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
                    const filteredUser = {
                        ...resp._doc,
                        password: await bcrypt.hash(req.body.password, SALT_WORK_FACTOR),
                    };

                    User.updateUser(user._id, filteredUser);

                    res.status(200).send()
                }).catch((_) => {
                res.status(404).json({
                    error: 'Failed to active user account',
                });
            });
        }
    );
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const userInfo = User.getUser(refreshToken._id);

        if (refreshToken.accessId !== userInfo.refresh) {
            res.sendStatus(401);
            return;
        }

        const accessToken = jwt.sign(user.name, process.env.AUTH_JWT_SECRET, {
            expiresIn: '15m',
        });
        res.json({accessToken});
    });
});

router.delete('/logout', (req, res) => {
    const refreshToken = req.body.token;

    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const userInfo = User.getUser(refreshToken._id);

        if (refreshToken.accessId !== userInfo.refresh) {
            res.sendStatus(401);
            return;
        }

        userInfo.accessId = null;
        User.updateUser(userInfo._id, userInfo)
            .then((resp) => res.sendStatus(200))
            .catch((err) => res.sendStatus(400));
    });
});

router.put('/:id/profilePic', multer.single('profilePic'), (req, res) => {
    const {id} = req.params;

    // verificar se o arquivo foi enviado
    if (!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
    }

    // nome unico pra imagem
    const extensionName = path.extname(req.file.name);
    const profilePicName = `${uuidv4()}.${extensionName}`;

    const metaData = {
        'Content-Type': req.file.mimetype,
    };

    // enviar imagem pro bucket S3 do MinIO
    minioClient.putObject(
        BUCKET_NAME,
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

            const imageUrl = `http://${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${profilePicName}`;

            // update no user
            User.updateUserProfilePic(id, imageUrl)
                .then(() =>
                    res
                        .status(200)
                        .json({
                            message: 'Profile picture updated successfully',
                            imageUrl,
                        })
                )
                .catch((err) =>
                    res
                        .status(500)
                        .json({
                            error: 'Failed to update user profile picture',
                            details: err,
                        })
                );
        }
    );
});

router.get('/:id', (req, res) => {
    User.getUser(req.params.id)
        .then((resp) => {
            const filteredUser = {
                username: resp.username,
                email: resp.email,
                location: resp.location,
                bio: resp.bio,
                name: resp.name,
            };

            res.status.json(filteredUser);
        })
        .catch((err) => res.sendStatus(466));
});

router.put(
    '/:id/update',
    validateRequest({
        body: schemaValidation.object({
            //TODO redo ask RUI
            bodyKey: schemaValidation.number(),
        }),
    }),
    (req, res) => {
        User.updateUser(req.params.id, req.body)
            .then((resp) => {
                res.status.json(resp);
            })
            .catch((err) => res.sendStatus(447));
    }
);

router.put('/:id/password', async function (req, res) {
    User.updateUserPassword(req.params.id, await bcrypt.hash(req.body.password, SALT_WORK_FACTOR))
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((erro) => {
            res.sendStatus(448);
        });
});

router.post('/:id/otp', (req, res) => {
    const userInfo = User.getUser(req.query.id);

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
    userInfo.otpSecret = secret;

    User.updateUser(userInfo._id, userInfo)
        .then((_) => res.json({totp: totp.toString()}))
        .catch((_) => res.status(488));
});

router.delete('/:id/otp', (req, res) => {
    const userInfo = User.getUser(req.query.id);

    if (!userInfo.otpEnabled) return res.sendStatus(401);

    userInfo.otpEnabled = false;

    User.updateUser(userInfo._id, userInfo)
        .then((_) => res.sendStatus(200))
        .catch((_) => res.status(447));
});

router.put('/update-email-preferences/:id', async (req, res) => {
    const { id } = req.params;
    const { preferences } = req.body;

    // preferencias existentes
    const validPreferences = ['projectUpdates', 'newFeatures', 'marketing', 'projectCollaborations', 'comments'];

    // verificacao
    const invalidPreferences = Object.keys(preferences).filter(
        (key) => !validPreferences.includes(key)
    );

    if (invalidPreferences.length > 0) {
        return res.status(400).json({
            error: 'Invalid preferences provided',
            invalidPreferences,
        });
    }

    try {
        const user = await User.getUser(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // update preferences
        const updatedPreferences = { ...user.emailPreferences, ...preferences };

        user.emailPreferences = updatedPreferences;
        
        await User.updateUser(id, user);

        res.status(200).json({
            message: 'Email preferences updated successfully',
            emailPreferences: updatedPreferences,
        });
    } catch (error) {
        console.error('Error updating email preferences:', error);
        res.status(500).json({
            error: 'Failed to update email preferences',
            details: error.message,
        });
    }
});

export default router;
