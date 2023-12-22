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
	if (data._id) {
		console.log('Peticion para actualizar un modelo de mensaje');
		try {
			const newMessageModelSaved = await messageModel.findByIdAndUpdate(
				data._id.toString(),
				data,
				{ new: true }
			);
			return res.json({ message: 'Modelo actualizado con éxito', newMessageModelSaved });
		} catch (error) {
			console.log('Error al actualizar modelo de mensaje');
			return res
				.status(500)
				.json({ message: 'Ocurrio un error al intentar modificar modelo de mensaje' });
		}
	}
	const newMessageModel = new messageModel(data);
	const newMessageModelSaved = await newMessageModel.save();

	return res.json({ message: 'Modelo creado y guardado con éxito', newMessageModelSaved });
};

export const deleteMessageModel = async (req: Request, res: Response) => {
	const { modelID } = req.query;
	try {
		await messageModel.findByIdAndDelete(modelID);
		return res.json({ message: 'Modelo eliminado' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Ocurrio un error al eliminar modelo' });
	}
};
