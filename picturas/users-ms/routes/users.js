import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../email/sendEmail.js';
import * as OTPAuth from 'otpauth';

import * as User from '../controller/user.js';
import multer from '../config/multerConfig.js';  
import minioClient from '../config/minioClient.js';
import * as z from '../../utils/zodDemo.js';
import { v4 as uuidv4 } from 'uuid';
import { schemaValidation } from '@picturas/filter-helper';
const BUCKET_NAME = 'bucket-name'; // **TROCAR PELO bucket-name do MinIO**

const router = Router();

const kinds = {
    resetPassword: 'resetPassword',
    validateAccount: 'validateAccount',
    login2phase: 'login2phase',
};

const issuer = 'Picturas - Stolen from UMinho Students Work';

router.post('/', async (req, res) => {
    User.addUser(req.body)
        .then((user) => {
            const filteredUser = {
                _id: user._id,
                kind: kinds.validateAccount,
            };

            const validationToken = jwt.sign(
                filteredUser,
                process.env.VALIDATE_JWT_SECRET,
                { expiresIn: '24h' },
            );
            sendEmail(user.email, validationToken, kinds.validateAccount);
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(444)
                .json({ error: 'Failed to add user' });
        });
});

router.post('/login', async (req, res) => {
    const user = User.getUserByEmail(req.body.email);

    if (user == null) {
        return res.status(400)
            .send('Cannot find user');
    }

    if (!user.active) {
        return res.status(401)
            .send('User must be validated first');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const filteredUser = {
                _id: user._id,
                kind: kinds.login2phase,
            };

            const validationToken = jwt.sign(
                filteredUser,
                process.env.VALIDATE_JWT_SECRET,
                { expiresIn: '15m' },
            );

            res.status(200)
                .json({
                    validationToken,
                    requiresOtp: user.otpEnabled,
                });
        } else {
            res.status(555)
                .json({ error: 'Invalid Password' });
        }
    } catch {
        res.status(445)
            .send();
    }
});

router.post('/login/2', async (req, res) => {
    jwt.verify(
        req.body.validationToken,
        process.env.VALIDATE_JWT_SECRET,
        (err, user) => {
            if (err) return res.sendStatus(403);
            if (user.kind !== kinds.login2phase) return res.sendStatus(403);

            const userInfo = User.getUser(user._id);

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
                { expiresIn: '15m' },
            );

            const randomBytes = crypto.randomBytes(16)
                .toString('hex');
            filteredUser.accessId = randomBytes;
            const refreshToken = jwt.sign(
                filteredUser,
                process.env.REFRESH_JWT_SECRET,
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

router.post('/passwordRecovery', async (req, res) => {
    await User.findUserByEmail(req.body.email)
        .then((user) => {
            const filteredUser = {
                _id: user._id,
                kind: kinds.resetPassword,
            };

            const validationToken = jwt.sign(
                filteredUser,
                process.env.VALIDATE_JWT_SECRET,
                { expiresIn: '24h' },
            );
            sendEmail(user.email, validationToken, kinds.resetPassword);
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(404)
                .json({ error: 'Failed to find the user' });
        });
});


router.get('/:id', (req, res) => {
    User.getUser(req.params.id)
        .then((resp) => {
            const filteredUser = {
                username: resp.username,
                email: resp.email,
                location: resp.location,
                bio: resp.bio,
                nome: resp.nome
            };

            res.status.json(filteredUser);
        })
        .catch((err) => res.sendStatus(446));
});

router.put('/:id/update', validateRequest({
    body: schemaValidation.object({ //TODO redo ask RUI
        bodyKey: schemaValidation.number(),
    })}), (req, res) => {

    User.updateUser(req.params.id, req.body)
        .then((resp) => {
            res.status.json(resp);
        })
        .catch((err) => res.sendStatus(447));
});

router.put('/:id/password', function(req, res) {
    User.updateUserPassword(req.params.id, req.body.password)
        .then((data) => {
            res.status(201)
                .json(data);
        })
        .catch((erro) => {
            res.sendStatus(448);
        });
});

router.post('/:id/otp', (req, res) => {
    const userInfo = User.getUser(req.query.id);

    if (userInfo.otpEnabled) return res.sendStatus(401);

    const secret = new OTPAuth.Secret({ size: 20 });

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
        .then((_) => res.json({ totp: totp.toString() }))
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
        res.json({ accessToken });
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
    const { id } = req.params;

    // verificar se o arquivo foi enviado
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // nome unico pra imagem
    const extensionName = path.extname(req.file.name);
    const profilePicName = `${uuidv4()}.${extensionName}`;

    const metaData = {
        'Content-Type': req.file.mimetype,
    };

    // enviar imagem pro bucket S3 do MinIO
    minioClient.putObject(BUCKET_NAME, profilePicName, req.file.buffer, metaData, (err, etag) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to upload image to MinIO', details: err });
        }

        const imageUrl = `https://${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${profilePicName}`;

        // update no user
        User.updateUserProfilePic(id, imageUrl)
            .then(() => res.status(200).json({ message: 'Profile picture updated successfully', imageUrl }))
            .catch((err) => res.status(500).json({ error: 'Failed to update user profile picture', details: err }));
    });
});

router.put('/update-email-preferences/:id', async (req, res) => {
    const userId = req.params.id;
    const preferences = req.body.preferences; // duvida 

    // preferencias existentes
    const validPreferences = ['projectUpdates', 'newFeatures', 'marketing', 'projectCollaborations', 'comments'];

    // validacao das preferencias
    if (!Array.isArray(preferences) || !preferences.every(pref => validPreferences.includes(pref))) {
        return res.status(400).json({ message: 'Preferências inválidas' });
    }

    try {
        const user = await User.getUser(userId); 

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // update das preferencias
        user.emailPreferences = preferences; 
        const updatedUser = await User.updateUser(userId, user); 

        return res.status(200).json({
            message: 'Preferências de email atualizadas com sucesso',
            preferences: updatedUser.emailPreferences, 
        });
        
    } catch (err) {
        console.error(`Erro ao atualizar preferências de email: ${err.message}`);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

export default router;
