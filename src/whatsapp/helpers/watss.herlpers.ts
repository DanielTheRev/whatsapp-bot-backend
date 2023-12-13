import path from 'path';
import fs from 'fs/promises';

import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Buenos_Aires');

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
	const hour = Number(dayjs().format('H'));
	let saludo = '';
	switch (true) {
		case hour >= 0 && hour <= 4:
			saludo = 'Buenas noches';
			break;
		case hour > 4 && hour <= 11:
			saludo = 'Buenos dias';
			break;
		case hour >= 11 && hour <= 19:
			saludo = 'Buenas tardes';
			break;
		case hour >= 19 && hour <= 23:
			saludo = 'Buenas noches';
			break;

		default:
			saludo = '';
			break;
	}
	return saludo;
}
