# Swastik — AI Interior & Architectural Visualizer

A polished, full-stack AI-powered interior and architectural visualization tool built for architects and interior designers. Upload your client's existing space, add inspiration references, describe requirements, and let AI generate personalized design concepts.

---

## Features

- **Upload your actual space** — Room photos become the canvas for transformation
- **Add inspiration references** — Pinterest/Instagram saves guide the AI's design direction
- **Structured requirements** — Budget (₹), style, colors, materials, design brief
- **AI Design Analysis** — Intelligent analysis of all inputs before generation
- **3–4 AI-generated concepts** — Personalized to the client's actual room
- **Fullscreen image viewer** — High-quality concept presentation
- **Concept refinement** — Quick actions (Change Sofa, Wall Color, etc.) + custom instructions
- **Design history** — Visual timeline of all revisions
- **Before / After comparison** — Side-by-side and interactive slider
- **Download concepts** — Save any generated image
- **Demo Mode** — Full workflow without an API key using bundled sample images
- **Responsive design** — Works on desktop, laptop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | OpenAI gpt-image-1 / dall-e-3 |
| Styling | Inter + Playfair Display fonts |
| Upload | Multer (memory storage) |

---

## Project Structure

```
swastik/
├── client/                  React + Vite frontend
│   ├── src/
│   │   ├── components/      All UI components
│   │   ├── pages/           Home.jsx, DesignStudio.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js       Proxy: /api → localhost:5000
│   └── package.json
│
├── server/                  Node.js + Express backend
│   ├── routes/              analyze.js, generate.js, refine.js
│   ├── services/            openaiImageService.js, analysisService.js
│   ├── middleware/          upload.js (multer)
│   ├── server.js
│   └── package.json
│
├── public/
│   └── demo-images/         5 architectural SVG concepts for Demo Mode
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd swastik
```

### 2. Install all dependencies

```bash
# Install client dependencies
npm install --prefix client

# Install server dependencies
npm install --prefix server
```

---

## Environment Variables

### 3. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
OPENAI_API_KEY=sk-...your-key-here...
PORT=5000
NODE_ENV=development
```

**If you leave `OPENAI_API_KEY` empty, the app runs in Demo Mode automatically.**

---

## OpenAI API Configuration

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file as `OPENAI_API_KEY=sk-...`

The app uses **gpt-image-1** (GPT Image model) as the primary model, with automatic fallback to **dall-e-3** if gpt-image-1 is not available on your account.

> Note: Image generation costs approximately $0.04–$0.08 per concept (dall-e-3 HD). Generating 4 concepts costs roughly $0.16–$0.32 per run.

---

## Running Locally (Development)

You need **two terminals**:

### Terminal 1 — Start the backend

```bash
cd server
npm run dev
```

Server starts at: `http://localhost:5000`

### Terminal 2 — Start the frontend

```bash
cd client
npm run dev
```

Frontend starts at: `http://localhost:3000`

Open `http://localhost:3000` in your browser.

---

## Production Build

### Build the frontend (outputs to `server/public/`)

```bash
npm run build --prefix client
```

### Start the production server

```bash
cd server
NODE_ENV=production node server.js
```

The Express server serves both the API and the built React frontend from a single process at `http://localhost:5000`.

---

## Deployment

### Deploy to Railway / Render / Fly.io

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Create a new service pointing to your repo
3. Set environment variables in the platform dashboard:
   - `OPENAI_API_KEY=sk-...`
   - `NODE_ENV=production`
   - `PORT=5000` (or leave blank — platforms set this automatically)
4. Set the build command: `npm install --prefix client && npm run build --prefix client && npm install --prefix server`
5. Set the start command: `node server/server.js`

### Deploy to Vercel / Netlify (frontend only)

For frontend-only deployment, point the API calls to a separately deployed Express backend (Railway/Render recommended for the server).

---

## Demo Mode

If `OPENAI_API_KEY` is empty or not set, Swastik automatically enters **Demo Mode**:

- A subtle "Demo Mode" badge appears in the header
- The complete 6-step workflow still functions
- 5 pre-built architectural SVG concepts are used as AI results
- Generation is simulated with a 3–5 second delay
- The user's uploaded room image is shown as the "Before" in comparisons
- Refinement cycles through the demo images

**This means you can demonstrate the full product to a client without connecting a real API key.**

---

## How to Demo (Step-by-Step)

1. Open Swastik in browser
2. Click **Start Designing**
3. Upload any room photo (JPG/PNG)
4. Optionally upload a floor plan
5. Click **Continue to Inspiration**
6. Upload 2–3 reference/inspiration images
7. Click **Continue to Requirements**
8. Select: Budget → Style → Colors → Materials → write a design brief
9. Click **Analyze My Requirements** — view the AI analysis
10. Click **Generate Design Concepts** — watch the loading animation
11. View the 4 generated concepts
12. Click **View Fullscreen** on any concept
13. Click **Use This Concept** to enter the refinement flow
14. Click a quick action (e.g. "Change Sofa") or write a custom instruction
15. Click **Generate Revised Design**
16. Compare Original vs Revised using the Before/After slider
17. Download any concept

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Generation fails immediately | Check `OPENAI_API_KEY` is set correctly |
| Rate limit errors | Wait 60 seconds and try again |
| Images show as broken | Check server is running on port 5000 |
| Demo mode when key is set | Restart server after adding key to `.env` |
| Build fails | Run `npm install --prefix client` again |

---

## Budget Note

> Budget guidance shown in the AI Analysis is an AI-generated design direction, not a final construction or procurement estimate. Always consult a qualified interior designer or contractor for actual costs.
