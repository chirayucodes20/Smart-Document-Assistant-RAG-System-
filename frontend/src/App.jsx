import { useState } from 'react';
import axios from 'axios';
import { Send, Upload, Bot, User, Loader2 } from 'lucide-react'; // Icons laye hain
import './App.css';

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! Main aapka AI Assistant hoon. Pehle ek PDF upload karein.", sender: "bot" }
  ]);
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. PDF Upload Karne Ka Logic ---
  const handleUpload = async () => {
    if (!file) return alert("Pehle file select karo bhai!");
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file); // Backend 'file' expect kar raha hai

    try {
      await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsUploaded(true); // Ab Chat screen dikhao
      setMessages([{ text: "PDF Upload ho gayi! Ab aap isme se kuch bhi puch sakte hain.", sender: "bot" }]);
    } catch (error) {
      console.error("Upload Failed:", error);
      alert("Upload nahi ho paya. Backend chal raha hai na?");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Chat Karne Ka Logic ---
  const handleSend = async () => {
    if (!question.trim()) return;

    const newMessages = [...messages, { text: question, sender: "user" }];
    setMessages(newMessages);
    setQuestion(""); 
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", question);

      const response = await axios.post("http://127.0.0.1:8000/query", formData);
      
      setMessages(prev => [...prev, { text: response.data.answer, sender: "bot" }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error: Jawab nahi mila.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* --- Sidebar / Header --- */}
      <div className="sidebar">
        <h2>🤖 AI DocuChat</h2>
        <p>Apne Documents se baat karein</p>
        <div className="status-badge">
            {isUploaded ? "🟢 System Online" : "🔴 Waiting for PDF"}
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="main-content">
        
        {/* SCENE 1: UPLOAD SCREEN (Jab tak upload na ho) */}
        {!isUploaded ? (
          <div className="upload-container">
            <div className="upload-box">
              <Upload size={60} color="#10a37f" />
              <h3>Upload your PDF</h3>
              <p>AI ko padhne ke liye document dein</p>
              
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
              
              <button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? <Loader2 className="spin" /> : "Start Analysis"}
              </button>
            </div>
          </div>
        ) : (
          /* SCENE 2: CHAT SCREEN (Upload ke baad) */
          <>
            <div className="chat-window">
              {messages.map((msg, index) => (
                <div key={index} className={`message-row ${msg.sender}`}>
                    <div className="avatar">
                        {msg.sender === 'bot' ? <Bot size={20}/> : <User size={20}/>}
                    </div>
                    <div className="message-bubble">
                        {msg.text}
                    </div>
                </div>
              ))}
              {isLoading && (
                  <div className="message-row bot">
                      <div className="avatar"><Loader2 className="spin" size={20}/></div>
                      <div className="message-bubble typing">Thinking...</div>
                  </div>
              )}
            </div>

            <div className="input-area">
              <input 
                type="text" 
                placeholder="Ask something about the PDF..." 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} disabled={isLoading}>
                <Send size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;