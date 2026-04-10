import React, { useState, useRef, useEffect, useCallback } from 'react';
import Orbs from './components/Orb';

const API_URL = 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('jarvis_session_id') || '');
  const [greeting, setGreeting] = useState('');
  const chatRef = useRef(null);
  const ttsRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = useCallback((text) => {
    if (!ttsEnabled || !text) return;
    ttsRef.current?.stop();
    ttsRef.current = new (window.speechSynthesis || window.AudioContext);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/jarvis/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId, tts: ttsEnabled }),
      });

      const data = await res.json();
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem('jarvis_session_id', data.session_id);
      }

      const assistantMsg = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMsg]);

      if (ttsEnabled && data.response) {
        speak(data.response);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChip = (msg) => {
    sendMessage(msg);
  };

  return (
    <div className="app">
      <div id="orb-container" className={speaking ? 'speaking' : loading ? 'active' : ''}>
        <Orbs />
      </div>

      <header className="header glass-panel">
        <div className="header-left">
          <h1 className="logo">J.A.R.V.I.S</h1>
          <span className="tagline">Just A Rather Very Intelligent System</span>
        </div>
        <div className="header-center">
          <div className="mode-switch" id="mode-switch">
            <div className="mode-slider" id="mode-slider"></div>
            <button className="mode-btn active" data-mode="jarvis">Jarvis</button>
          </div>
        </div>
        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
          </div>
          <button className="btn-icon new-chat-btn" onClick={() => { setMessages([]); setSessionId(''); localStorage.removeItem('jarvis_session_id'); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="chat-area" ref={chatRef}>
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h2 className="welcome-title">{greeting}.</h2>
              <p className="welcome-sub">How may I assist you today?</p>
              <div className="welcome-chips">
                <button className="chip" onClick={() => handleChip('What can you do?')}>What can you do?</button>
                <button className="chip" onClick={() => handleChip('Open YouTube for me')}>Open YouTube</button>
                <button className="chip" onClick={() => handleChip('Tell me a fun fact')}>Fun fact</button>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))
          )}
          {loading && (
            <div className="message assistant">
              <div className="message-content">Thinking...</div>
            </div>
          )}
        </div>
      </main>

      <footer className="input-bar glass-panel">
        <div className="input-wrapper">
          <textarea
            id="message-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Jarvis anything..."
            rows={1}
          />
          <div className="input-actions">
            <button className={`action-btn tts-btn ${ttsEnabled ? 'active' : ''}`} onClick={() => { setTtsEnabled(!ttsEnabled); if (speaking) stopSpeaking(); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                {ttsEnabled && <><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>}
              </svg>
            </button>
            <button className="action-btn send-btn" onClick={() => sendMessage()} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;