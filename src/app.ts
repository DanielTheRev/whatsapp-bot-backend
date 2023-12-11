import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { AuthRouter } from './routes/authentication.routes';
import { connectWS } from './websocket';
import { DatabaseRouter } from './routes/database.routes';
import { MessageModelRouter } from './routes/messageModels.routes';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', AuthRouter);
app.use('/api', DatabaseRouter);
app.use('/api', MessageModelRouter);

const server = app.listen(app.get('port'), () => console.log('server on port: ', app.get('port')));

connectWS(server);
