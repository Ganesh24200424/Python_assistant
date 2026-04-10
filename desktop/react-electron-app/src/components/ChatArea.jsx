import { useState, useRef, useEffect } from 'react'
import { useApi } from '../hooks/useApi.js'

const ChatArea = () => {
  const { sendMessage, isStreaming } = useApi()
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (text) => {
    if (!text.trim() || isStreaming) return
    
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    
    // Send to backend
    sendMessage(text)
  }

  return (
    <main className="chat-area">
      <div className="chat-messages" id="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-screen" id="welcome-screen">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 className="welcome-title" id="welcome-title">Good evening.</h2>
            <p className="welcome-sub">How may I assist you today?</p>
            <div className="welcome-chips">
              <button className="chip" onClick={() => handleSend('What can you do?')}>What can you do?</button>
              <button className="chip" onClick={() => handleSend('Open YouTube for me')}>Open YouTube</button>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="msg-body">
              <div className="msg-label">{msg.role === 'user' ? 'You' : 'Jarvis'}</div>
              <div className="msg-content">{msg.content}</div>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="message assistant" id="typing-msg">
            <div className="msg-body">
              <div className="msg-label">Jarvis</div>
              <div className="msg-content">
                <span className="msg-stream-text">...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  )
}

export default ChatArea

