
console.log(process.env.DB_URI);
export const INITIAL_CONFIG = {
	MONGO_DB: {
		path: process.env.DB_URI || 'mongodb+srv://larrosadaniel2894:%40Unarefacil1@myportfolio.bmyo4mk.mongodb.net/whatsapp-bot',
		production: Boolean(process.env.DB_URI)
	},
	SECRET_KEY: process.env.SECRET_KEY || 'test'
};
