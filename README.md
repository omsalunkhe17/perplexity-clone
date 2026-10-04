# Perplexity Clone

A full-stack AI-powered search and chat platform inspired by Perplexity AI, built with React, Node.js, Express, MongoDB, Socket.IO, LangChain, and Google Gemini / Groq.

## Project Structure

```text
perplexity-c/
├── BACKEND/       # Node.js, Express, MongoDB, LangChain & Socket.IO server
└── FRONTEND/      # React 19, Redux Toolkit, TailwindCSS & Vite client
```

## Getting Started

### 1. Backend Setup

```bash
cd BACKEND
npm install
```

Create a `.env` file in `BACKEND/` (you can copy `.env.example`):

```bash
cp .env.example .env
```

Fill in your API keys and credentials in `.env`:
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `TAVILY_API_KEY`
- Google OAuth credentials for email verification

Start the backend:
```bash
npm run dev
```
Backend runs on `http://localhost:3000`.

---

### 2. Frontend Setup

In a new terminal:
```bash
cd FRONTEND
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.
