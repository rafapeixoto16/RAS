import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const vars = {
    validateAccount: {
        title: 'Confirm your Account Creation',
        description:
            'Please click the button below to confirm your email address.',
    },
    resetPassword: {
        title: 'Reset Password',
        description:
            'We received a request to reset your password. Click the button below to create a new password.',
    },
};

function renderTemplate(filePath, variables) {
    const path = resolve(dirname(fileURLToPath(import.meta.url)), filePath);
    const template = readFileSync(path, 'utf-8');

    return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
        return key in variables ? variables[key] : match;
    });
}

export default function sendEmail(email, token, kind) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOSTNAME,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const content = renderTemplate('./template.html', {
        frontendUrl: process.env.FRONTEND_URL,
        token,
        path: kind,
        ...vars[kind],
    });

    transporter.sendMail({
        from: process.env.EMAIL_EMAIL,
        to: email,
        subject: 'Picturas',
        html: content,
    });
}
