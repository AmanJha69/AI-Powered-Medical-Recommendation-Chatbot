# AI-Powered Medical Recommendation Chatbot

A full-stack healthcare assistant that provides AI-generated symptom guidance, medicine suggestions, health tips, and doctor recommendations in real time.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, Mongoose
- **Database:** MongoDB
- **AI:** Google Gemini API

## Disclaimer

This application provides general health information only. It is **not** a substitute for professional medical advice, diagnosis, or treatment. For medical emergencies, contact your local emergency services immediately.

## Project Structure

```
medical-chatbot/
├── client/          # React frontend
├── server/          # Express + Socket.IO backend
└── README.md
```

## Prerequisites

- Node.js 20+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

## Setup

### 1. Clone and install

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment

**Server** — copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/medical-chatbot
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash
```

**Client** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed doctor data

```bash
cd server
npm run seed
```

### 4. Run locally

Terminal 1 (backend):

```bash
cd server
npm run dev
```

Terminal 2 (frontend):

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user (auth) |
| GET | `/api/chats` | List chats (auth) |
| POST | `/api/chats` | Create chat (auth) |
| GET | `/api/chats/:id` | Get chat + messages (auth) |
| DELETE | `/api/chats/:id` | Delete chat (auth) |
| POST | `/api/chats/:id/messages` | Send message via REST (auth) |
| GET | `/api/doctors?symptom=` | Doctor recommendations (auth) |

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_chat` | client → server | Join chat room |
| `send_message` | client → server | Send message, triggers AI |
| `receive_message` | server → client | New message |
| `typing_start` / `typing_stop` | both | Typing indicators |
| `ai_thinking` | server → client | AI loading state |

## Deployment

### MongoDB Atlas
1. Create a free cluster
2. Add your IP to network access
3. Copy connection string to `MONGODB_URI`

### Backend (Render / Railway)
1. Connect GitHub repo, set root to `server`
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Set all env vars from `.env.example`
5. Set `CLIENT_URL` to your frontend URL

### Frontend (Vercel / Netlify)
1. Connect repo, set root to `client`
2. Build: `npm run build`
3. Set `VITE_API_URL` and `VITE_SOCKET_URL` to backend URL

## Demo Flows

1. **New user:** Register → login → click "Headache" chip → AI reply with tips and doctors
2. **Returning user:** Login → open past chat → continue conversation
3. **Urgent symptom:** Type "chest pain" → high urgency warning + emergency guidance

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| server | `npm run dev` | Start dev server |
| server | `npm run build` | Compile TypeScript |
| server | `npm run seed` | Seed doctor data |
| client | `npm run dev` | Start Vite dev server |
| client | `npm run build` | Production build |

## License

Educational / internship project.
