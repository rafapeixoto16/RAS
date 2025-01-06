import express from 'express'
import bcrypt from 'bcrypt'
import User from '../controllers/user';
import { getUser } from '../controler/user.js';
const app = express()
const SALT_WORK_FACTOR = 10;

app.get('/', (req, res) => {
    //res.json(users)
})

app.post('/', async (req, res) => {
    User.addUser(req.body).then(dados => res.status(201).jsonp({ dados: dados })).catch(err => {
        res.status(444).jsonp({ error: 'Failed to add user'});
    });
})

app.post('/users/login', async (req, res) => {
    const user = User.getUser(req.body.email)

    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {//fixme verify
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})
