import { Database } from '../interfaces/database.interface';
import { Schema, model } from 'mongoose';

const databaseSchema = new Schema<Database>({
	userID: String,
	nombre: String,
	data: [{}]
});

export const DatabaseModel = model<Database>('Database', databaseSchema);
