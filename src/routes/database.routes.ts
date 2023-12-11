import { createDatabase, getDatabases } from '../controllers/databases.controller';
import { Router } from 'express';

export const DatabaseRouter = Router();

DatabaseRouter.get('/getDatabases', getDatabases);
DatabaseRouter.post('/createDatabase', createDatabase);
