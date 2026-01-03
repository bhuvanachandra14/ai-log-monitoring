# LogMonitor 🛡️

**AI-Powered Cloud Log Intelligence Platform**

LogMonitor is a real-time log aggregation and analysis dashboard. It uses Google Gemini AI to instantly analyze system logs, detect patterns, and provide conversational insights for debugging complex incidents.

### 🔴 [Live Demo](https://bhuvanachandra14.github.io/ai-log-monitoring/)

![LogMonitor Dashboard](./frontend/public/vite.svg)
*(Note: Screenshot/Logo placeholder)*

---

## 🚀 Features

-   **Real-time Log Ingestion**: Accepts JSON logs via HTTP POST from any application.
-   **AI Analyst**: Integrated Chat Assistant (Gemini 2.0 Flash) to interpret errors and answer system queries.
-   **Streaming Responses**: Instant AI feedback with zero lag.
-   **Live Dashboard**: Auto-refreshing UI with error level highlighting and filtering.
-   **Cloud Ready**: Backend deployed on Render, Frontend on GitHub Pages.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite, TailwindCSS
-   **Backend**: Python, FastAPI, SQLModel (SQLite)
-   **AI**: Google Gemini API (Generative AI)
-   **Deployment**: Render (Backend), GitHub Pages (Frontend)

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/bhuvanachandra14/ai-log-monitoring.git
    cd ai-log-monitoring
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    pip install -r requirements.txt
    # Create .env file with GEMINI_API_KEY=...
    python main.py
    ```

3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🔗 Integration

Connect your app by sending a POST request:

```bash
curl -X POST "https://ai-log-monitoring-7yka.onrender.com/logs" \
     -H "Content-Type: application/json" \
     -d '{"level": "ERROR", "service": "payment-service", "message": "Transaction declined: Gateway timeout"}'
```

---
Made with ❤️ by Bhuvan
