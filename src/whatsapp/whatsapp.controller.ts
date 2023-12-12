import makeWASocket, {
	WASocket,
	WAConnectionState,
	DisconnectReason,
	delay
} from '@whiskeysockets/baileys';
import { UserWhatsapp } from '../interfaces/user.interface';
import { fileAuthState, getDayStatus } from './helpers/watss.herlpers';
import { Boom } from '@hapi/boom';
import chalk from 'chalk';
import { Socket } from 'socket.io';
import { DatabaseModel } from '../models/database.model';
import { messageModel } from '../models/messageModel.model';
import { ITask } from '../interfaces/task.interface';

export let userWspController: UserWhatsapp[] = [];
export let UserTask: { userID: string; tasks: ITask[] }[] = [];

export const startWhatsappController = (data: UserWhatsapp) => {
	console.log(`starting whatsapp controller to userID: ${data.userID}`);
	let wspUser = getOrCreateUser(data);
	updateUserSocketID(wspUser.userID, data.socket);
	wspUser = { ...data, wspConnState: wspUser.wspConnState };
	WspInstance(wspUser);
	data.socket.on('whatsapp-connection-connect', () => {
		console.log('connection-connect');
		createWspInstance(data);
	});
	const tasksUser = UserTask.find((e) => e.userID === wspUser.userID);
	data.io.to(data.socket.id).emit('get-task-user', { tasks: tasksUser?.tasks || [] });

	data.socket.on(
		'create-task',
		async (
			data: {
				MessageModel: { _id: string; name: string };
				Database: { _id: string; nombre: string };
			},
			cb
		) => {
			const database = await DatabaseModel.findById(data.Database._id);
			const MessageModelSelected = await messageModel.findById(data.MessageModel._id);
			if (!database) return cb({ success: false, message: 'no existe esa base de datos' });
			if (!MessageModelSelected) return cb({ success: false, message: 'no existe ese modelo' });
			const newTask = {
				_id: crypto.randomUUID(),
				state: 'Esperando',
				cantidad_mensajes: database.data.length,
				progress: 0,
				modelo_mensaje: data.MessageModel,
				base_de_datos: data.Database
			};
			const user_tasks_idx = UserTask.findIndex((e) => e.userID === wspUser.userID);

			if (user_tasks_idx === -1) {
				const newTaskUser = {
					userID: wspUser.userID,
					tasks: [newTask]
				};
				UserTask.push(newTaskUser);
				return cb(newTask);
			}
			UserTask[user_tasks_idx].tasks.push(newTask);

			return cb(newTask);

			// const messages: any[] = [];
			// const rawMessage = MessageModelSelected.message ;
			// database.data.forEach((cliente) => {
			// 	const message = rawMessage.replace(/\$(\w+)/g, (_, variable) => {
			// 		return cliente[variable];
			// 	});
			// 	messages.push(message);
			// });
		}
	);
	data.socket.on('task: send-messages', async (task: ITask, cb) => {
		const database = await DatabaseModel.findById(task.base_de_datos._id);
		const MessageModelSelected = await messageModel.findById(task.modelo_mensaje._id);
		if (!database) return cb({ success: false, message: 'no existe esa base de datos' });
		if (!MessageModelSelected) return cb({ success: false, message: 'no existe ese modelo' });

		console.log(getOrCreateUser(wspUser));
		for await (const [index, client] of database.data.entries()) {
			let taskProgress = (index / database.data.length) * 100;

			getOrCreateUser(wspUser).io.to(data.socket.id).emit('task: progress', {
				taskid: task._id,
				progress: taskProgress,
				state: 'Enviando'
			});
			const UserTaskIDX = UserTask.findIndex((e) => e.userID === wspUser.userID);
			const taskIDX = UserTask[UserTaskIDX].tasks.findIndex((t) => t._id === task._id);
			if (UserTaskIDX !== -1) {
				UserTask[UserTaskIDX].tasks[taskIDX].progress = taskProgress;
				UserTask[UserTaskIDX].tasks[taskIDX].state = 'Enviando';
			}
			let Message = MessageModelSelected.message.replace(/\$(\w+)/g, (_, variable) => {
				if (variable === 'Saludo') {
					return getDayStatus();
				}
				return client[variable];
			});
			try {
				await delay(1000);
				const messageSend = await getOrCreateUser(wspUser).wspInstance?.sendMessage(
					`5491150562309@s.whatsapp.net`,
					{
						text: Message
					}
				);
				console.log(messageSend);
			} catch (error) {
				console.log(error);
			}
			if (index === database.data.length - 1) {
				data.io.to(data.socket.id).emit('task: progress', {
					taskid: task._id,
					progress: 100,
					state: 'Tarea terminada'
				});
			}
		}
	});
};

const WspInstance = async (user: UserWhatsapp) => {
	const { io, socket, wspConnState } = user;
	io.to(socket.id).emit('whatsapp-connection-status', user.wspConnState);
};

const createWspInstance = async (userConnected: UserWhatsapp) => {
	const user = userConnected;
	const { state, saveCreds } = await fileAuthState(user.userID);
	const newWsp = makeWASocket({
		printQRInTerminal: false,
		auth: state,
		browser: ['Gestor de mensajeria', 'Gestor de mensajeria', 'Gestor de mensajeria'],
		syncFullHistory: true
	});
	const userWsp: UserWhatsapp = {
		...user,
		wspInstance: newWsp
	};
	wspEvents(userWsp, saveCreds);
};

const wspEvents = (user: UserWhatsapp, saveCreds: () => Promise<void>) => {
	user.wspInstance?.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
		console.log(chalk.blueBright(connection));
		if (qr !== null) {
			user.io.to(user.socket.id).emit('whatsapp-connection-qr', qr);
		}

		getOrCreateUser(user)
			.io.to(getOrCreateUser(user).socket.id)
			.emit('whatsapp-connection-status', user.wspConnState);
		if (connection !== undefined) {
			updateUserWspState(user.userID, connection, user.wspInstance!);
			getOrCreateUser(user)
				.io.to(getOrCreateUser(user).socket.id)
				.emit('whatsapp-connection-status', connection);
		}

		if (connection === 'close') {
			const shouldReconnect =
				(lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
			console.log(
				'connection closed due to ',
				lastDisconnect?.error,
				', reconnecting ',
				shouldReconnect
			);
			// reconnect if not logged out
			if (shouldReconnect) {
				createWspInstance(user);
			}
		} else if (connection === 'open') {
			await delay(1000);
			console.log(chalk.bgGreen('opened connection'));
			updateUserWspState(user.userID, 'open', user.wspInstance!);
			user.io.to(user.socket.id).emit('whatsapp-connection-status', 'open');
		}
	});
	user.wspInstance?.ev.on('creds.update', saveCreds);
	user.wspInstance?.ev.on('messages.upsert', async (m) => {
		console.log(chalk.blueBright(`Mensaje de ${m.messages[0].pushName}`));
		getOrCreateUser(user).io.to(getOrCreateUser(user).socket.id).emit('wsp-history', m);
		// await user.wspInstance?.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' });
	});
	user.wspInstance?.ev.on('messaging-history.set', (messageHistory) => {
		getOrCreateUser(user)
			.io.to(getOrCreateUser(user).socket.id)
			.emit('wsp-history', messageHistory);
	});
};

export const addUser = (user: UserWhatsapp) => {
	!userWspController.some((wsp) => wsp.userID === user.userID) && userWspController.push(user);
};

export const getOrCreateUser = (userConnected: UserWhatsapp) => {
	const userFinded = userWspController.find((usr) => usr.userID === userConnected.userID);
	if (!userFinded) {
		userWspController.push(userConnected);
		return userConnected;
	}
	return userFinded!;
};

export const updateUserWsp = (userID: string, Wsp: WASocket) => {
	const user = userWspController.findIndex((usr) => usr.userID === userID);
	userWspController[user].wspInstance = Wsp;
};

export const updateUserSocketID = (userID: string, socket: Socket) => {
	userWspController = userWspController.map((usr) => {
		if (usr.userID === userID) {
			return {
				...usr,
				socket,
				socketID: socket.id
			};
		}
		return usr;
	});
};

export const updateUserWspState = (
	userID: string,
	state: WAConnectionState,
	instance: WASocket
) => {
	userWspController = userWspController.map((usr) => {
		if (usr.userID === userID) {
			usr.wspConnState = state;
			usr.wspInstance = instance;
		}
		return usr;
	});
};
