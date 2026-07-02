import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
    'http://localhost:63342',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://messengerwire-production-6230.up.railway.app',
    'https://messengerwire-production.up.railway.app',
];

const corsOrigin = (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
    }
    console.log('CORS blocked origin:', origin); // 👈 Для отладки
    return callback(new Error('Not allowed by CORS'));
};

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: corsOrigin,
    credentials: true
}));

app.use('/api/auth', authRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/user', userRouter);

export default app;