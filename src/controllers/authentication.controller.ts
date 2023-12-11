import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import jwt from 'jsonwebtoken';

import { RegisterUserDTO, loginUserDTO } from '../interfaces/user.interface';
import { INITIAL_CONFIG } from '../config';

export const LoginUser = async (req: Request, res: Response) => {
	const data = req.body as loginUserDTO;
	const User = await UserModel.findOne({ email: data.email });
	if (!User) return res.status(400).json({ message: 'Usuario no encontrado' });

	try {
		const passwordCompared = await UserModel.comparePassword(data.password, User.password);
		if (passwordCompared) {
			const token = jwt.sign({ userID: User.id }, INITIAL_CONFIG.SECRET_KEY, {
				expiresIn: '10 hrs'
				// expiresIn: '5s'
			});

			return res.json({
				user: {
					_id: User._id,
					name: User.name,
					email: User.email,
					gender: User.gender
				},
				token
			});
		}
		return res.status(500).json({ message: 'error perrito' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Hubo un error gg'
		});
	}
};

export const registerUser = async (req: Request, res: Response) => {
	const userData = req.body as RegisterUserDTO;
	console.log(userData);
	try {
		const newUser = new UserModel(userData);
		const newUserSaved = await newUser.save();
		return res.json({ userSaved: newUserSaved, message: 'usuario guardado' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'usuario no guardado :v' });
	}
};

export const verifyUserToken = async (req: Request, res: Response) => {
	const { token } = req.body as { token: string };
	if (!token) return res.status(500).json({ message: 'No se envió el token' });
	try {
		const decoded = jwt.verify(token, INITIAL_CONFIG.SECRET_KEY) as { userID: string };
		const user = await UserModel.findById(decoded.userID).select([
			'_id',
			'name',
			'gender',
			'email'
		]);
		return res.json({ user });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ valid: false });
	}
};
