import dotenv from 'dotenv';
import './app';
import { connectDB } from './database';

dotenv.config();

connectDB();
