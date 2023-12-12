import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.DB_URI);
export const INITIAL_CONFIG = {
	MONGO_DB: {
		path: process.env.DB_URI || 'mongodb://127.0.0.1:27017/whatsapp-bot',
		production: Boolean(process.env.DB_URI)
	},
	SECRET_KEY: process.env.SECRET_KEY || 'test'
};
