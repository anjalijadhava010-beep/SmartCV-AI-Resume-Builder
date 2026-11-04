# Smart Resume Builder with AI Suggestions

A beginner-friendly full-stack project built with React + Vite, Node.js + Express, MongoDB, and optional OpenAI API integration.

## Features
- Resume form: personal details, summary, education, experience, projects, skills and links
- Live resume preview
- AI-powered improvement suggestions (uses OpenAI when configured; otherwise a built-in demo suggestion engine)
- Save and load the latest resume using MongoDB
- Print / Save as PDF using the browser's print dialog
- Responsive layout

## 1. Requirements
Install:
- Node.js LTS (includes npm)
- VS Code
- MongoDB Atlas account (free shared cluster) or local MongoDB

Check installation in VS Code terminal:
```bash
node -v
npm -v
```

## 2. Open the project
Extract the ZIP. Open the `Smart-Resume-Builder` folder in VS Code.

## 3. Start the backend
Open a terminal in VS Code:
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and fill in your settings:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/smart_resume_builder?retryWrites=true&w=majority
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
```
- In MongoDB Atlas, create a free cluster, create a database user, allow your IP address in Network Access, and copy the Node.js connection string.
- Replace `YOUR_USER`, `YOUR_PASSWORD`, and `YOUR_CLUSTER`. URL-encode special characters in your password.
- `OPENAI_API_KEY` is optional. If omitted, the app uses its built-in demo suggestions. Never put this key in the React `client` folder or commit `.env` to GitHub.

Run:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

## 4. Start the frontend
Open a SECOND terminal:
```bash
cd client
npm install
npm run dev
```
Open the URL printed by Vite (normally `http://localhost:5173`).

## 5. Test the project
1. Fill in your name, email, summary, education, skills and projects.
2. Check the live preview on the right.
3. Click **Get AI suggestions**. With no API key, demo suggestions still appear.
4. Click **Save resume** to store it in MongoDB.
5. Click **Load saved resume** to retrieve the latest saved resume.
6. Click **Download PDF** and choose **Save as PDF** in the browser print window. Select A4 paper and enable background graphics if you want the colours.

## 6. Common problems
- **MongoDB connection error:** Check the URI, database user/password, IP allowlist and internet connection. The app can still run without MongoDB, but save/load needs a working database.
- **AI not working:** Check the backend terminal and API key. OpenAI API billing is separate from a ChatGPT subscription. If you do not configure an API key, demo suggestions are used.
- **CORS error:** Keep `CLIENT_URL=http://localhost:5173` and open the frontend using the Vite URL.
- **Port already in use:** Change `PORT` in `server/.env`, then update `client/src/App.jsx` API base URL if you change the backend port.

## Project structure
```text
Smart-Resume-Builder/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── server/
    ├── models/Resume.js
    ├── routes/resumeRoutes.js
    ├── routes/aiRoutes.js
    ├── server.js
    ├── .env.example
    └── package.json
```

## How to explain it in your project viva
- **React:** collects resume details and displays a live preview.
- **Node.js + Express:** provides REST API endpoints between frontend and database/AI service.
- **MongoDB + Mongoose:** stores resume documents.
- **OpenAI API:** analyses the entered resume and returns improvement suggestions (optional).
- **Print CSS:** formats the preview for A4 printing; the browser saves it as a PDF.

## API endpoints
- `GET /api/health` — backend status
- `POST /api/resumes` — save resume
- `GET /api/resumes/latest` — load latest resume
- `POST /api/ai/suggestions` — generate resume suggestions
