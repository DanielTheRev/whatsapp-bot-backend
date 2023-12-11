import { WAConnectionState, WASocket } from '@whiskeysockets/baileys';
import { Document, Model } from 'mongoose';
import { Server, Socket } from 'socket.io';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	gender: string;
	encryptPassword: (password: string) => Promise<any>;
	comparePassword: (password: string, receivedPassword: string) => Promise<any>;
}

export interface IUserModel extends Model<IUser> {
	encryptPassword: (password: string) => Promise<any>;
	comparePassword: (password: string, receivedPassword: string) => Promise<any>;
}

export interface loginUserDTO {
	email: string;
	password: string;
}

export interface RegisterUserDTO {
	name: string;
	email: string;
	password: string;
	gender: string;
}

export interface UserWhatsapp {
	userID: string;
	io: Server;
	socket: Socket;
	wspInstance: WASocket | undefined;
	wspConnState: WAConnectionState
}
