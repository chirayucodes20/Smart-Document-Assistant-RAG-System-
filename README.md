# 🤖 AI DocuChat: Chat with your PDFs

> **A Full-Stack RAG (Retrieval Augmented Generation) Application built with FastAPI, React, and Groq AI.**

![Project Screenshot](./frontend/public/vite.svg) 
*(Note: Replace this line with your actual screenshot link later)*

## 🚀 About The Project

This project solves the problem of reading long, boring PDF documents. Instead of scrolling through hundreds of pages, users can simply **upload a PDF** and **chat with it** like they are talking to a human expert.

It uses **RAG Architecture** to ensure the AI answers strictly from the document context, reducing hallucinations.

### ✨ Key Features
* **📂 Drag & Drop Upload:** Seamless PDF upload interface.
* **💬 Interactive Chat:** Real-time conversation with documents.
* **🧠 Smart Context:** Uses Vector Embeddings (ChromaDB) to find relevant answers.
* **⚡ Blazing Fast:** Powered by Groq's Llama-3 API for instant responses.
* **🎨 Modern UI:** Dark mode, glassmorphism design, and responsive layout.

---

## 🛠️ Tech Stack

### **Frontend**
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React.js (Vite)**
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) **Modern CSS** (Glassmorphism)
* **Axios** (API Integration)

### **Backend**
* ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) **FastAPI** (Python)
* ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) **Python 3.10+**
* **Uvicorn** (ASGI Server)

### **AI & Database**
* 🦜️🔗 **LangChain** (Framework)
* 🦙 **Groq API** (Llama-3-70b Model)
* 🗂️ **ChromaDB** (Vector Store)

---

## ⚙️ How It Works (Architecture)

1.  **Ingestion:** The user uploads a PDF.
2.  **Chunking:** The backend splits the text into smaller chunks.
3.  **Embedding:** Text chunks are converted into vector numbers using HuggingFace embeddings.
4.  **Storage:** Vectors are stored in ChromaDB (Local Vector Database).
5.  **Retrieval:** When a user asks a question, the system searches for the most relevant chunks.
6.  **Generation:** The relevant text + user question is sent to Groq AI to generate an answer.

---

## 💻 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/rag-ai-project.git](https://github.com/YOUR_USERNAME/rag-ai-project.git)
cd rag-ai-project
2. Backend Setup (Python)
Bash
# Create virtual environment
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
Create a .env file in the root folder and add your API key:

Code snippet
GROQ_API_KEY="your_gsk_api_key_here"
Run the Backend Server:

Bash
uvicorn main:app --reload
3. Frontend Setup (React)
Open a new terminal:

Bash
cd frontend
npm install
npm run dev
🚀 Open your browser at http://localhost:5173 to view the app!