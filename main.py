import os
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
import io
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq  # <--- Nayi Cheez!

app = FastAPI() # Ye line pehle se hogi

# --- CORS Setup (Naya Code) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Sabko allow karo (Testing ke liye)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Variables ---
vector_store = None 
llm = None

# --- Setup LLM (Groq) ---
load_dotenv()  # .env file se secret key padhega

groq_api_key = os.getenv("GROQ_API_KEY") # Key variable mein aayi
llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=groq_api_key) # AI start hua

def get_pdf_text(pdf_bytes):
    pdf_reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

def get_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    return chunks

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global vector_store
    content = await file.read()
    text = get_pdf_text(content)
    chunks = get_chunks(text)
    
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = Chroma.from_texts(texts=chunks, embedding=embeddings)
    
    return {"status": "Document Ready! Ab sawaal pucho."}

@app.post("/query")
async def query_document(question: str = Form(...)):
    global vector_store, llm
    
    if vector_store is None:
        return {"error": "Pehle document upload karo bhai!"}
    
    if llm is None:
        return {"error": "API Key nahi mili code mein!"}

    # 1. Retrieval: Sahi context dhoondo
    results = vector_store.similarity_search(question, k=2)
    context_text = "\n\n".join([doc.page_content for doc in results])
    
    # 2. Augmentation: Prompt banao
    prompt = f"""
    You are a helpful assistant. Use the following context to answer the question.
    If the answer is not in the context, say "I don't know".
    
    Context:
    {context_text}
    
    Question: {question}
    
    Answer:
    """
    
    # 3. Generation: AI se jawaab maango
    response = llm.invoke(prompt)
    
    return {
        "question": question,
        "answer": response.content  # <--- Asli AI jawaab!
    }