import path from 'path';
import fs from 'fs/promises';
import { useMultiFileAuthState } from '@whiskeysockets/baileys';

export const fileAuthState = async (userID: string) => {
	const filePath = `${path.join(__dirname, '../auth', `${userID}`)}`;
	try {
		await fs.mkdir(filePath);
	} catch (error) {
		console.log(`La carpeta del usuario ${userID} para Auth ya ha sido creada.`);
	}
	return await useMultiFileAuthState(filePath);
};

export function getDayStatus() {
	const date = new Date();
	const hour = date.getHours();
	let saludo = '';
	if (hour >= 0 && hour < 12) {
		saludo = 'Buenos días';
	} else if (hour >= 12 && hour < 18) {
		saludo = 'Buenas tardes';
	} else {
		saludo = 'Buenas noches';
	}
	return saludo;
}
