# 🎯 CodeParlor — Collaborative Interview Preparation Platform

**CodeParlor** (talent-IQ) is a full-stack, real-time interview prep platform where developers can host or join live coding sessions, solve LeetCode-style problems together, communicate via live video/chat, and track progress — all in one place.

---

## ✨ Features

- 🔐 **Authentication** — Secure sign-up/sign-in via [Clerk](https://clerk.com/)
- 🧩 **Problem Library** — Browse curated coding problems with difficulty filters (Easy / Medium / Hard)
- 💻 **Live Code Editor** — Monaco-powered in-browser code editor with syntax highlighting
- 📹 **Video & Chat** — Real-time video calls and text chat powered by [Stream](https://getstream.io/)
- 🗂️ **Session Management** — Create, join, and track coding sessions with host/participant roles
- 📊 **Dashboard** — View active sessions, recent sessions, and personal statistics
- ⚡ **Background Jobs** — Inngest-powered event-driven background functions
- 🚀 **Production Ready** — Backend serves the React frontend as static files in production

---

## 🖥️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 + DaisyUI | Styling |
| @clerk/clerk-react | Authentication |
| @monaco-editor/react | In-browser code editor |
| @stream-io/video-react-sdk | Video calling |
| stream-chat-react | Real-time chat |
| @tanstack/react-query | Server state management |
| Axios | HTTP client |
| Lucide React | Icon library |
| react-resizable-panels | Resizable layout panels |
| react-hot-toast | Toast notifications |
| canvas-confetti | Celebration animations |
| date-fns | Date formatting |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express v5 | REST API server |
| MongoDB + Mongoose | Database |
| @clerk/express | Auth middleware |
| @stream-io/node-sdk | Stream token generation |
| stream-chat | Chat management |
| Inngest | Background job processing |
| dotenv | Environment config |
| CORS | Cross-origin requests |

---

## 📁 Project Structure

```
talent-IQ/
├── frontend/                   # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx        # Landing page
│       │   ├── DashboardPage.jsx   # User dashboard
│       │   ├── ProblemsPage.jsx    # Problem list
│       │   ├── ProblemPage.jsx     # Single problem editor
│       │   └── SessionPage.jsx     # Live coding session
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── CodeEditor.jsx
│       │   ├── VideoCallUi.jsx
│       │   ├── ActiveSessions.jsx
│       │   ├── RecentSessions.jsx
│       │   ├── CreateSessionModal.jsx
│       │   ├── OutputPanel.jsx
│       │   ├── PanelDescription.jsx
│       │   ├── StatsCards.jsx
│       │   └── WelcomeSection.jsx
│       └── App.jsx
└── backend/                    # Express API server
    └── src/
        ├── server.js               # Entry point
        ├── models/
        │   ├── User.js
        │   └── Session.js
        ├── controller/
        │   ├── sessionController.js
        │   └── chatController.js
        ├── routes/
        │   ├── sessionRoutes.js
        │   └── chatRoutes.js
        ├── middleware/
        └── lib/
            ├── db.js               # MongoDB connection
            ├── env.js              # Env config
            └── inngest.js          # Background jobs
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Inngest (background jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Stream (video & chat)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Clerk (authentication)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** instance (local or Atlas)
- Accounts on [Clerk](https://clerk.com/), [Stream](https://getstream.io/), and [Inngest](https://www.inngest.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Samir-github2005/CodeParlor.git
   cd CodeParlor
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` in both `frontend/` and `backend/` directories and fill in your credentials.

4. **Start development servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser.

---

## 📦 Production Build

From the root directory:

```bash
npm run build   # Installs deps and builds frontend
npm start       # Starts the backend (serves frontend static files)
```

The Express server will serve the compiled React app and expose the API on the same port.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `POST` | `/api/session` | Create a new session |
| `GET` | `/api/session` | Get all active sessions |
| `GET` | `/api/session/:id` | Get a session by ID |
| `PATCH` | `/api/session/:id/join` | Join a session |
| `PATCH` | `/api/session/:id/complete` | Mark session as completed |
| `POST` | `/api/chat/token` | Generate Stream chat token |
| `POST` | `/api/inngest` | Inngest event handler |

---

## 🗃️ Data Models

### Session
```js
{
  problem: String,          // Problem name/title
  difficulty: "easy" | "medium" | "hard",
  host: ObjectId → User,
  participant: ObjectId → User,
  status: "active" | "completed",
  callerId: String,         // Stream video call ID
  timestamps: true
}
```

### User
```js
{
  clerkId: String,          // Clerk user ID
  name: String,
  email: String,
  // ...
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'Add awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Samir Bhakta**
- GitHub: [@Samir-github2005](https://github.com/Samir-github2005)
- Repository: [CodeParlor](https://github.com/Samir-github2005/CodeParlor)
