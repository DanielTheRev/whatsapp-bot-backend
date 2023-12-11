export interface DB_Item {
	contacto_num: number;
	[key: string]: any;
}

export interface Database {
	_id?: string;
	userID: string;
	nombre: string;
	data: DB_Item[];
}
