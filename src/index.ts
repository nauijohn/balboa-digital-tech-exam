import './controllers/BooksController';
import './controllers/UsersController';

import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';

import { AppRouter } from './AppRouter';
import { SequelizeConnection } from './SequelizeConnection';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['laskdjf'] }));
app.use(AppRouter.getInstance());

SequelizeConnection.connectToDb().sync({ alter: true });

app.listen(3000, () => console.log('Listening on port 3000'));
