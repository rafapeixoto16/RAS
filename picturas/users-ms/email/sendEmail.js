import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

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
            user: `no-reply@${process.env.EMAIL_HOSTNAME}`,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const content = renderTemplate('./template.html', {
        frontendUrl: process.env.FRONTEND_URL,
        token,
        path: kind,
    });

    transporter.sendMail({
        from: `no-reply@${process.env.EMAIL_HOSTNAME}`,
        to: email,
        subject: 'Picturas',
        html: content,
    });
}
