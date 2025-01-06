import express from 'express'
import bcrypt from 'bcrypt'
import { getUser, addUser, getUserByEmail, User, updateUserPassword, updateUser } from '../controller/user.js';
const app = express()
const router = express.Router();

router.post('/', async (req, res) => {
    User.addUser(req.body).then(dados => res.status(201).jsonp({ dados: dados })).catch(err => {
        res.status(444).jsonp({ error: 'Failed to add user'});
    });
})

router.post('/users/login', async (req, res) => {
    const user = User.getUserByEmail(req.body.email) //TODO token maybe

    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {//fixme verify
        if(await bcrypt.compare(req.body.password, user.password)) {
            //TODO token
        } else {

        }
    } catch {
        res.status(445).send()
    }
})

router.get('/:id',  (req, res) => {
    User.getUser(req.params.id).then(resp => res.status.jsonp(resp)).catch(err => res.status(446).send(err))
})

router.put('/:id/update',  (req, res) => {
    User.updateUser(req.params.id,req.body).then(resp => res.status.jsonp(resp)).catch(err => res.status(447).send(err))
})

router.put('/:id/password', function (req, res) {
    User.updateUserPassword(req.params.id, req.body.password)
        .then(dados => {
            res.status(201).jsonp(dados);
        })
        .catch(erro => {
            res.status(448).render('error', { error: erro, message: 'Erro na alteração do utilizador' });
        });
});


