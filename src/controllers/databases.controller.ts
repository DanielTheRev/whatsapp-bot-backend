import { Request, Response } from 'express';
import { DatabaseModel } from '../models/database.model';

export const getDatabases = async (req: Request, res: Response) => {
	const query = req.query;
	const data = await DatabaseModel.find({ owner_id: query.userID });
	return res.json(data);
};

export const createDatabase = async (req: Request, res: Response) => {
	const data = req.body;

	const newDatabase = new DatabaseModel(data);
	const newDatabaseSaved = await newDatabase.save();

	return res.json({ newDatabaseSaved });
};

export const deleteDatabase = async (req: Request, res: Response) => {
	const { databaseID } = req.query;
	try {
		await DatabaseModel.findByIdAndDelete(databaseID);
		return res.json({ message: 'Base de datos eliminada con éxito' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error al eliminar base de datos, reinicie la pagina' });
	}
};
