import { ConnectionStates, connect, connection } from 'mongoose';
import { INITIAL_CONFIG } from './config';
import chalk from 'chalk';

let connectionState: ConnectionStates = 0;

export async function connectDB() {
	if (connectionState === 1) return;
	const conn = await connect(INITIAL_CONFIG.MONGO_DB.path);
	connectionState = conn.connections[0].readyState;
}

connection.on('connected', () => {
	const message = chalk.green(
		`${INITIAL_CONFIG.MONGO_DB.production ? 'Production' : 'Developed'}`
	);
	console.log(`Connected to MongoDB on ${message}`);
});

connection.on('error', (error) => {
	console.log(error);
	console.log(
		chalk.red(
			`Error connecting to MongoDB ${
				INITIAL_CONFIG.MONGO_DB.production ? 'on Production' : 'on Developed'
			}`
		)
	);
});
