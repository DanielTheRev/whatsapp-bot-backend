import { Database } from '../interfaces/database.interface';
import { Schema, model } from 'mongoose';

const databaseSchema = new Schema<Database>(
	{
		owner_id: String,
		nombre: String,
		data: [{}]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const DatabaseModel = model<Database>('Database', databaseSchema);
