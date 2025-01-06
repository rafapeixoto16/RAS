import express from 'express';
import bcrypt from 'bcrypt';
import { getUser, addUser, getUserByEmail, User, updateUserPassword, updateUser } from '../controller/user.js';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer" ;

const app = express();
const router = express.Router();

const kinds = {
    resetPassword: 'ResetPassword',
    validateAccount: 'ValidateAccount'
}

router.post('/', async (req, res) => {
    User.addUser(req.body).then(user => {
            const filteredUser = { _id: user._id, kind: kinds.validateAccount };

            const validationToken = jwt.sign(filteredUser, process.env.VALIDATE_JWT_SECRET, { expiresIn: '24h' });
            sendEmail (user, validationToken, kinds.validateAccount);
            res.sendStatus(200);
    }
    ).catch(err => {
        res.status(444).jsonp({ error: 'Failed to add user' }); //TODO email
    });
});

router.post('/login', async (req, res) => {
    const user = User.getUserByEmail(req.body.email);

    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    if(!user.active){
        return res.status(401).send('User must be validated first');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const filteredUser = { _id: user._id, username: user.username, email: user.email };

            const accessToken = jwt.sign(filteredUser, process.env.AUTH_JWT_SECRET, { expiresIn: '15m' });//FIXME alterar nomes

            const randomBytes = crypto.randomBytes(16).toString('hex');
            filteredUser['accessId'] = randomBytes;
            const refreshToken = jwt.sign(filteredUser, process.env.REFRESH_JWT_SECRET);
            user.refresh = randomBytes;

            User.updateUser(user._id, user).then(_ => res.json({
                accessToken: accessToken,
                refreshToken: refreshToken,
            }))
                .catch(_ => res.status(447));

        } else {
            res.status(555).jsonp({ error: 'Invalid Password' });
        }
    } catch {
        res.status(445).send();
    }
});

router.post('/passwordRecovery', async (req, res) => {
    await User.findUserByEmail(req.body.email).then(user => {
            const filteredUser = { _id: user._id, kind: kinds.resetPassword };

            const validationToken = jwt.sign(filteredUser, process.env.VALIDATE_JWT_SECRET, { expiresIn: '24h' });
            sendEmail (user, validationToken, kinds.resetPassword);
            res.sendStatus(200);
        }
    ).catch(err => {
        res.status(404).jsonp({ error: 'Failed to find the user' }); //TODO email
    });
});

router.get('/:id', (req, res) => {
    User.getUser(req.params.id).then(resp => res.status.jsonp(resp)).catch(err => res.status(446).render('error', { message: err }));
});

router.put('/:id/update', (req, res) => {
    User.updateUser(req.params.id, req.body).then(resp => res.status.jsonp(resp)).catch(err => res.status(447).render('error', { message: err }));
});

router.put('/:id/password', function(req, res) {
    User.updateUserPassword(req.params.id, req.body.password)
        .then(dados => {
            res.status(201).jsonp(dados);
        })
        .catch(erro => {
            res.status(448).render('error', { error: erro, message: 'Error updating user' });
        });
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

        const accessToken = jwt.sign(user.name, process.env.AUTH_JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: accessToken });
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
        User.updateUser(userInfo._id, userInfo).then(resp => res.sendStatus(200)).catch(err => res.sendStatus(400));});
});

function sendEmail (user,token,kind){

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOSTNAME,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: `no-reply@${process.env.EMAIL_HOSTNAME}`,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    transporter.sendMail({
        from: `no-reply@${process.env.EMAIL_HOSTNAME}`,
        to: user.email,
        subject: kind,
        html: `<a href="${process.env.FRONTEND_URL}/validate/${token}" target="_blank">Click here!</a> max time is 24h.`,
    });
}
