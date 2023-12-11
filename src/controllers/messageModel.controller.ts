import { Request, Response } from 'express';
import { IMessageModel } from '../interfaces/messageModel.interface';
import { messageModel } from '../models/messageModel.model';

export const getMessageModels = async (req: Request, res: Response) => {
	const userID = req.query.userID;
	const data = await messageModel.find({ userID: userID });
	return res.json(data);
};

export const createMessageModels = async (req: Request, res: Response) => {
	const data = req.body as IMessageModel;
	const newMessageModel = new messageModel(data);
	const newMessageModelSaved = await newMessageModel.save();

	return res.json({ newMessageModelSaved });
};
