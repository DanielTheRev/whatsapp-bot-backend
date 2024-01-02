import chalk from 'chalk';
import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { INITIAL_CONFIG } from './config';
import { startWhatsappController } from './whatsapp/whatsapp.controller';
import { UserWhatsapp } from './interfaces/user.interface';

let UsersConnected: { userID: string; socketID: string }[] = [];

export const connectWS = (server: Server) => {
	const io = new SocketServer(server, {
		cors: {
			origin: 'http://localhost:4200',
			methods: ['GET', 'POST']
		},
		transports: ['websocket', 'polling'],
		path: '/project/whatsapp-bot/api/socket.io'
	});
	io.on('connection', async (socket) => {
		console.log(chalk.blue(`Nuevo usuario conectado, id: ${socket.id}`));
		try {
			const token = socket.handshake.auth.token;
			console.log(chalk.bgBlue(chalk.white(`token: ${token}`)));
			const { userID } = jwt.verify(token, INITIAL_CONFIG.SECRET_KEY) as { userID: string };
			AddUser(userID, socket.id);

			const initWsData: UserWhatsapp = {
				userID,
				io: io,
				socket,
				wspInstance: undefined,
				wspConnState: 'close'
			};
			startWhatsappController(initWsData);
		} catch (error) {
			console.log(error);
			console.log(chalk.red(error));
		}

		socket.on('disconnect', () => {
			const user = UsersConnected.find((e) => e.socketID === socket.id);
			if (user) {
				RemoveUser(user.userID);
			}
			console.log(chalk.red(`Usuario desconectado ${socket.id}`));
		});
	});
};

const AddUser = (userID: string, socketID: string) => {
	const userFindedIndex = UsersConnected.findIndex((usr) => usr.userID === userID);
	if (userFindedIndex === -1) {
		UsersConnected.push({
			userID,
			socketID
		});
		return;
	}
	UsersConnected[userFindedIndex].socketID = socketID;
	return;
};

const RemoveUser = (userID: string) => {
	console.log('borrando usuario');
	UsersConnected = UsersConnected.filter((e) => e.userID !== userID);
};
