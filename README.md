# Marky - AI Powered Note Highlighter

[Marky Demo Video](https://youtu.be/ws5HI290-7M)

## � Table of Contents
- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## 🚀 Problem Statement

In the modern academic and professional landscape, individuals are inundated with vast amounts of textual information. Whether it's 100-page research papers, dense lecture notes, or lengthy technical documentation, processing this information effectively is a significant challenge.

**Key Pains:**
*   **Information Overload:** Struggling to filter noise from signal.
*   **Time Inefficiency:** Spending hours manually reading and highlighting documents.
*   **Retention Issues:** Difficulty in quickly reviewing core concepts before exams or meetings.
*   **Loss of Context:** Skimming often leads to missing crucial connecting details.

## 💡 Solution Overview

**Marky** helps you study smarter, not harder. It is an intelligent web application that automates the cognitive task of identifying key information.

By leveraging **Google Gemini AI** (specifically the 1.5 Flash model for its large context window and speed), Marky parses your PDF documents, semantically understands the content, and identifies the most significant sentences and concepts. It then "reads" the document for you and applies highlights directly to the PDF, generating a revision-ready file in seconds.

## ✨ Key Features

*   **⚡ Instant Analysis**: Upload a PDF and get a highlighted version back in seconds.
*   **🧠 AI-Powered Context**: Uses LLMs to understand the *meaning* of the text, not just keyword matching.
*   **🎯 Precision Highlighting**: Pinpoints exact phrases and sentences deemed critical for easy scanning.
*   **📂 Standard PDF Output**: The downloaded file works in any PDF reader (Adobe, Preview, Edge, etc.).
*   **🔒 Secure & Private**: Files are processed in memory and not permanently stored on the server.
*   **🎨 Modern UI**: Built with Shadcn UI and Tailwind CSS for a clean, distraction-free experience.

## ⚙️ How It Works

The application follows a streamlined data flow to process your documents:

1.  **Upload**: The user uploads a PDF via the Next.js frontend.
2.  **Extraction**: The FastAPI backend receives the file and uses `PyMuPDF` to extract raw text.
3.  **AI Analysis**: The full text (up to 30k characters) is sent to **Google Gemini 1.5 Flash** with a specific prompt to "identify the 5-10 most important sentences for revision".
4.  **Vector Search**: The backend searches for the exact coordinates of the AI-identified sentences within the original PDF pages.
5.  **Annotation**: Yellow highlights are applied to the identified text coordinates.
6.  **Response**: The modified PDF is streamed back to the frontend for display and download.

## 📂 Project Structure

```bash
MARKY/
├── backend/                 # Python/FastAPI Backend
│   ├── main.py              # Entry point and application logic
│   ├── .env                 # Environment variables (API Keys)
│   ├── .gitignore           # Git ignore rules for backend
│   └── venv/                # Local Python virtual environment
│
├── frontend/                # TypeScript/Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router pages (layout.tsx, page.tsx)
│   │   ├── components/      # Reusable UI components (buttons, cards)
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies and scripts
│   └── next.config.ts       # Next.js configuration
│
└── README.md                # Project documentation
```

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router) - For server-side rendering and fast page loads.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) - For type-safe robust code.
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - utility-first CSS framework.
-   **Components**: [Shadcn UI](https://ui.shadcn.com/) - Accessible, reusable components built on Radix UI.
-   **HTTP Client**: Native `fetch` API.
-   **Icons**: [Lucide React](https://lucide.dev/).
-   **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/).

### Backend
-   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High-performance, easy-to-learn web framework.
-   **Language**: Python 3.9+
-   **AI Integration**: [Google Generative AI SDK](https://pypi.org/project/google-generativeai/).
-   **PDF Engine**: [PyMuPDF (fitz)](https://pymupdf.readthedocs.io/) - Fast PDF parsing and annotation.
-   **Utilities**: `python-dotenv` for environment management.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   **Node.js** (v18 or later)
-   **Python** (v3.9 or later)
-   **Gemini API Key**: Get a free key from [Google AI Studio](https://aistudio.google.com/).

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate   # macOS/Linux
    # OR
    venv\Scripts\activate      # Windows
    ```

3.  **Install Dependencies:**
    ```bash
    pip install fastapi uvicorn google-generativeai pymupdf python-dotenv
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in `backend/` and add your API Key:
    ```bash
    echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
    ```

5.  **Run the Server:**
    ```bash
    python main.py
    ```
    The server will start at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node Modules:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Access App:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## �️ Future Roadmap

-   [ ] **Multiple Colors**: Highlight different types of info (definitions vs. examples) in different colors.
-   [ ] **Custom Prompts**: Allow users to tell the AI what to look for (e.g., "Find all dates", "Highlight definitions").
-   [ ] **Page Selection**: choose specific pages to analyze to save tokens.
-   [ ] **Summary Generation**: Generate a text summary alongside the PDF.
-   [ ] **User Accounts**: Save history of processed documents.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Built with ❤️ by a developer who hates highlighting manually.*
