import {
	createMessageModels,
	deleteMessageModel,
	getMessageModels
} from '../controllers/messageModel.controller';
import { Router } from 'express';

export const MessageModelRouter = Router();

MessageModelRouter.get('/messageModels', getMessageModels);
MessageModelRouter.post('/createMessageModels', createMessageModels);
MessageModelRouter.delete('/deleteMessageModel', deleteMessageModel);
