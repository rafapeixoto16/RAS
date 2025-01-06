import express, { createError } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose'
import usersRouter from './routes/users';

const app = express();
const port = 3000;

var mongoBD = "mongodb://127.0.0.1/users" //TODO USER ENV
mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'));

db.once('open', () => {
    console.log('Conexão ao MongoDB realizada com sucesso');
});
app.use('/', usersRouter);
// Default configs
app.use(morgan('dev'));
app.use(express.json());

// Routers

// 404
app.use((req, res, next) => {
    next(createError(404));
});

// Error Handler
app.use((err, req, res) => {
    // TODO not sure if this is right, I must check
    res.status(err.status || 500).send();
});

// Listen
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on port ${port}`);
});

app.listen(3000)