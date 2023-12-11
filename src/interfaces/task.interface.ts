export interface ITask {
	_id: string;
	state: string;
	cantidad_mensajes: number;
	progress: number;
	modelo_mensaje: { _id: string; name: string };
	base_de_datos: { _id: string; nombre: string };
}
