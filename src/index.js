import dotenv from 'dotenv';
import start_agent from './app.js';

dotenv.config();

await start_agent();
