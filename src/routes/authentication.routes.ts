import { LoginUser, registerUser, verifyUserToken } from '../controllers/authentication.controller';
import { Router } from 'express';

export const AuthRouter = Router();

AuthRouter.post('/login', LoginUser);
AuthRouter.post('/register', registerUser);
AuthRouter.post('/verifyToken', verifyUserToken);
