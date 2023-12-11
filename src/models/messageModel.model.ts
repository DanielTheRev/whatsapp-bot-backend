import { IMessageModel } from '../interfaces/messageModel.interface';
import { Schema, model } from 'mongoose';

const messageModelSchema = new Schema<IMessageModel>({
	userID: String,
	name: String,
	message: String
});

export const messageModel = model<IMessageModel>('messageModel', messageModelSchema);
