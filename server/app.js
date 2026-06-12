import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';  // Для работы с import.meta.url

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();
// Получаем текущий путь к файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Путь к директории текущего файла

const app = express();

const allowedOrigins = [
    'http://localhost:63342',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5173',
    'http://localhost:5174',
];

const corsOrigin = (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
};

app.use(cookieParser());
app.use(express.json());
app.use(cors( {
    origin: corsOrigin,
    credentials: true
}));

// Подключение маршрутизатора аунтификации, авторизации и тп
app.use('/api/auth', authRouter );

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение маршрутизатора функций всего что связано с конечным пользователем
app.use('/api/user', userRouter)

export default app;