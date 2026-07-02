# Wire Messenger

**Full-stack pet-проект — real-time мессенджер с WebSocket-обменом сообщениями, статусами доставки в стиле Telegram, онлайн-присутствием и JWT-аутентификацией с auto-refresh.**

<!-- TODO: вставить бейджи / скриншот-баннер -->

**[Live Demo](<TODO: ссылка на задеплоенный фронтенд>)**

<div align="center">

![LIVE DEMO](https://img.shields.io/badge/LIVE_DEMO-00C7B7?style=for-the-badge)
![Messenger_Wire](https://img.shields.io/badge/Messenger_WIRE-000000?style=for-the-badge)

</div>

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-Modules-CC6699?style=for-the-badge&logo=sass&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Access+Refresh-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

</div>


---

## О проекте

Wire Messenger — это не учебный todo-лист и не статичный лендинг, а **production-oriented real-time приложение** с собственным REST API и WebSocket-слоем. Проект начинался как клиент на vanilla JS и был **полностью переписан на React + TypeScript** с современным тулингом — с акцентом на архитектуру, типобезопасность и корректную работу в реальном времени.

Ключевая ценность проекта — не набор экранов, а **инженерные решения под капотом**: аутентификация сокета по JWT с защитой от подмены отправителя, оптимистичные обновления кеша, статусы доставки сообщений (отправлено / прочитано / ошибка) как в Telegram, живое присутствие пользователей и прозрачный auto-refresh access-токена.

---

## Что умеет приложение

| | Раздел | Описание |
|---|---|---|
| 1 | **Аутентификация** | Регистрация / логин / выход, валидация форм, floating-label поля, анимированный фон, auto-refresh access-токена при 401 |
| 2 | **Список чатов** | Real-time сортировка (свежие сверху), последнее сообщение, счётчик непрочитанных, индикатор онлайн |
| 3 | **Обмен сообщениями** | Мгновенная доставка через WebSocket, оптимистичный рендер, история с ленивой подгрузкой |
| 4 | **Статусы доставки** | Часики (отправляется) → галочка (доставлено) → двойная галочка (прочитано) → ошибка — только на своих сообщениях, как в Telegram |
| 5 | **Прочтение и непрочитанные** | Отметка о прочтении при открытии чата, авто-прочтение в открытом чате, счётчики непрочитанных |
| 6 | **Онлайн-присутствие** | Статус «в сети / не в сети» обновляется в реальном времени при подключении/отключении собеседника |
| 7 | **Поиск и создание чатов** | Поиск пользователей по `@username` + фильтр существующих чатов по имени, создание приватного диалога без дублей |
| 8 | **Профиль** | Редактирование имени, `@username`, «о себе», загрузка и удаление аватара; просмотр профиля собеседника |
| 9 | **Уведомления** | Toast-уведомления о новых сообщениях в неактивных чатах (аватар + имя + текст), авто-скрытие |

---

## Стек

### Frontend · `/client-react`

| Категория | Технологии |
|---|---|
| Runtime | React 19 · TypeScript (strict) |
| Bundler | Vite · path-алиасы (`@/*`) |
| Styling | SCSS Modules |
| Server state | TanStack Query v5 |
| Client state | Zustand (+ persist) |
| Routing | React Router · ProtectedRoute / PublicRoute |
| Real-time | socket.io-client (типизированные события) |
| UI | lottie-react (пустые состояния) |
| Tooling | ESLint (flat config) · Prettier |

### Backend · `/server`

| Категория | Технологии |
|---|---|
| Runtime | Node.js · Express 5 (ESM) |
| Real-time | Socket.IO (JWT-middleware на handshake) |
| DB | PostgreSQL (`pg`, пул соединений) |
| Auth | JWT (access + refresh) · bcrypt · httpOnly refresh-cookie |
| Upload | Multer (аватары) |
| Deploy | Railway (client и server — отдельно) |

---

## Архитектура

```
Wire_messenger/
├── client-react/     SPA  ·  React + Vite + TypeScript
└── server/           API  ·  Express + Socket.IO + PostgreSQL
```

### Frontend

```
client-react/src/
├── pages/           — AuthPage, ChatPage (+ локальные components/)
├── components/      — переиспользуемые UI (Avatar, Button, Modal, Toast, EmptyState, icons…)
├── hooks/           — useChats, useMessages, useSendMessage,
│                      useIncomingMessages, useSocketConnection,
│                      useUserSearch, useCreatePrivateChat
├── store/           — Zustand: sessionStore, uiStore, toastStore
├── api/             — chatApi, profileApi (REST-обёртки)
├── lib/             — httpClient (auto-refresh), socket, queryClient,
│                      queryKeys, datetime, validation, config
├── types/           — chat, message, user, socket, search
└── styles/          — глобальные SCSS + переменные
```

### Backend

```
server/
├── routes/          — маршруты Express (auth, user, chats)
├── controllers/     — HTTP-логика + socketController (WebSocket)
├── models/          — доступ к PostgreSQL (SQL-запросы)
├── services/        — TokenService (JWT)
├── views/           — форматирование ответов API
├── config/          — db_connect (пул), multerUpload
├── middlewares/     — authenticateUserToken
└── schema.sql       — дамп схемы БД (для инициализации на проде)
```

---

## Ключевые инженерные решения

### 1. Безопасный WebSocket с аутентификацией по JWT

Сокет аутентифицируется **при подключении** через `handshake.auth.token`: middleware `io.use()` верифицирует access-токен и кладёт `userId` в сокет. Критично — `sender_id` сообщений и `readerId` прочтений берутся **из токена, а не из данных клиента**, что исключает отправку сообщений от чужого имени.

*Файлы: `server/controllers/socketController.js`, `client-react/src/lib/socket.ts`*

### 2. Статусы доставки как в Telegram

Каждое **своё** сообщение проходит цикл: `sending` (часики) → `sent` (галочка, подтверждение сервера через ack) → `read` (двойная галочка) → `error` (таймаут). Статусы — клиентское состояние доставки; факт прочтения (`is_read`) персистится в БД, чтобы галочки сохранялись после перезагрузки. Входящие (чужие) сообщения статуса не имеют.

*Файлы: `client-react/src/hooks/useSendMessage.ts`, `useIncomingMessages.ts`*

### 3. Оптимистичные обновления через TanStack Query

При отправке сообщение мгновенно вставляется в кеш с временным `tempId` и статусом `sending`, затем патчится реальным `id` по ack сервера — интерфейс отзывчив даже при медленной сети. Кеш чатов инвалидируется для real-time пересортировки списка.

### 4. Auto-refresh access-токена

`httpClient` перехватывает `401`, прозрачно ходит на `/auth/refresh` (refresh-токен в httpOnly-cookie), обновляет access-токен и **повторяет исходный запрос**. Рефреш — single-flight (один на все параллельные запросы через общий promise); при провале — очистка сессии и редирект на логин.

*Файл: `client-react/src/lib/httpClient.ts`*

### 5. Real-time присутствие и доставка без открытия чата

При подключении сокет присоединяется **ко всем комнатам чатов пользователя** — сообщения и счётчики непрочитанных приходят, даже если чат не открыт. Онлайн-статус обновляется через событие `presence`, рассылаемое собеседникам при коннекте/дисконнекте.

### 6. Разделение клиентского и серверного состояния

**Zustand** держит клиентское состояние (сессия, активный чат, тосты), **TanStack Query** — серверное (чаты, сообщения) с кешированием и инвалидацией. Чёткая граница ответственности вместо «одного большого стора».

---

## REST API

**Base URL (prod):** `<TODO: ссылка на задеплоенный сервер>`

| Метод | Endpoint | Auth | Описание |
|---|---|---|---|
| POST | `/api/auth/register` | — | Регистрация (username по умолчанию = login) |
| POST | `/api/auth/login` | — | Логин, выдаёт access + ставит refresh-cookie |
| POST | `/api/auth/refresh` | cookie | Обновляет access-токен |
| GET | `/api/user/me` | Bearer | Текущий пользователь |
| GET | `/api/user/chats` | Bearer | Список чатов пользователя |
| GET | `/api/user/chats/:chatId/messages` | Bearer | История сообщений (limit/offset) |
| POST | `/api/user/chats` | Bearer | Создать чат (private / group) |
| GET | `/api/user/search?username=` | Bearer | Поиск пользователя по username |
| PUT | `/api/user/updateProfile/:field` | Bearer | Обновить username / fullname / about |
| POST | `/api/user/updateProfile/avatar` | Bearer | Загрузить аватар (multipart) |
| DELETE | `/api/user/updateProfile/avatar` | Bearer | Удалить аватар |

### WebSocket-события

| Направление | Событие | Описание |
|---|---|---|
| client → server | `join_room` / `join_chat` | Присоединиться к комнате чата |
| client → server | `send_message` | Отправить сообщение (ack с id/created_at) |
| client → server | `mark_read` | Отметить сообщения прочитанными |
| server → client | `new_message` | Новое входящее сообщение |
| server → client | `messages_read` | Собеседник прочитал сообщения |
| server → client | `presence` | Изменение онлайн-статуса |

---

## Локальный запуск

### Требования

- Node.js 18+
- PostgreSQL 17

### 1. Клонирование

```bash
git clone <TODO: ссылка на репозиторий>
cd Wire_messenger
```

### 2. База данных

Создать БД и применить схему:

```bash
createdb messenger_db
psql -U postgres -d messenger_db -f server/schema.sql
```

### 3. Backend

```bash
cd server
npm install
```

Создать `server/.env`:

```
DB_USER="postgres"
DB_HOST="localhost"
DB_NAME="messenger_db"
DB_PASSWORD="postgres"
DB_PORT=5432
JWT_ACCESS_SECRET="<your-access-secret>"
JWT_REFRESH_SECRET="<your-refresh-secret>"
JWT_ACCESS_EXPIRES_IN="2h"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
```

Запустить сервер:

```bash
npm start
```

### 4. Frontend

```bash
cd client-react
npm install
npm run dev
```

Приложение: `http://localhost:5173`

---

## Скрипты

**Client** (`/client-react`)

```bash
npm run dev        # Vite dev-сервер с HMR
npm run build      # tsc -b && vite build
npm run preview    # превью прод-билда
npm run lint       # ESLint
npm run format     # Prettier
```

**Server** (`/server`)

```bash
npm start          # node server.js
```

---

## Что я хотел показать этим проектом

**Real-time инженерия** — WebSocket-слой с аутентификацией, статусами доставки, присутствием и корректной обработкой комнат.

**Архитектурное мышление** — разделение клиентского и серверного состояния, типизированные контракты, переиспользуемые компоненты и хуки, а не монолитный `App.tsx`.

**Понимание безопасности** — JWT-флоу с refresh в httpOnly-cookie, аутентификация сокета, `sender_id` из токена (защита от спуфинга), хеширование паролей.

**Уверенное владение TypeScript** — strict-режим, типизированные API- и socket-контракты, дискриминированные union-типы статусов.

**Работу с реальным состоянием** — TanStack Query (кеш, инвалидация, оптимистичные апдейты), Zustand, синхронизация UI в реальном времени.

**Внимание к деталям** — статусы сообщений, тосты, пустые состояния (Lottie), floating-label формы, микро-интеракции.

**Самостоятельный деплой** — Railway с разделением клиент/сервер, корректный CORS, env-переменные.

---

## Известные ограничения

- **Аватары** хранятся в файловой системе сервера (`server/uploads/`). На эфемерном хостинге (Railway) файлы не переживают передеплой — в продакшене решается вынесением в объектное хранилище (S3 / Cloudinary).
- Групповые чаты поддержаны на уровне схемы и API, UI создания группы — в планах.

---

## Лицензия

Проект создан исключительно в учебных и демонстрационных целях.

<!--
TODO перед публикацией:
- вставить ссылки: Live Demo, репозиторий, prod API URL
- добавить скриншоты/GIF в баннер и разделы
- указать автора и контакты
- проверить точные пути эндпоинтов auth (register/login) по своему authRouter
-->