import pgk from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Гарантированно загружаем .env ДО создания пула соединений.
// Раньше dotenv.config() вызывался только в app.js, и из-за порядка
// импортов ES-модулей пул мог читать process.env раньше, чем переменные
// были загружены, — тогда пароль уходил в дефолт 'root' и падало auth_failed (28P01).
// Указываем абсолютный путь к server/.env, чтобы это не зависело от рабочей папки запуска.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {Pool} = pgk;

const pool = new Pool( {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'messenger_db',
    password: process.env.DB_PASSWORD || 'root',
    port: parseInt(process.env.DB_PORT) || 5432,
    max: parseInt(process.env.DB_POOL_MAX) || 20, // Максимальное количество соединений
    idleTimeoutMillis: 30000, // Закрыть соединение после 30 сек неактивности
    connectionTimeoutMillis: 5000, // Ошибка, если подключение дольше 5 сек
    allowExitOnIdle: true, // Разрешить завершение процесса, когда соединения простаивают
});

export default pool;