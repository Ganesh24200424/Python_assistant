import { useEffect, useRef, useState } from 'react'
import Orb from './utils/orb.js'
import style from './index.css' assert { type: 'css' }

function App() {
  const appRef = useRef(null)
  const orbContainerRef = useRef(null)
  const [orb, setOrb] = useState(null)

  useEffect(() => {
    // Import orb dynamically
    import('./utils/orb.js').then(module => {
      if (orbContainerRef.current) {
        setOrb(new module.OrbRenderer(orbContainerRef.current, {
          hue: 0,
          hoverIntensity: 0.3,
          backgroundColor: [0.02, 0.02, 0.06]
        }))
      }
    })
  }, [])

  return (
    <div className="app" ref={appRef}>
      <div id="orb-container" ref={orbContainerRef}></div>
      <Header />
      <ChatArea />
      {/* Input bar */}
      <footer className="input-bar glass-panel">
        <div className="input-wrapper">
          <textarea 
            placeholder="Ask Jarvis anything..."
            rows="1"
          />
          <div className="input-actions">
            {/* Action buttons */}
            <button className="action-btn send-btn">Send</button>
          </div>
        </div>
      </footer>
      {/* Panels: activity, settings, etc. */}
    </div>
  )
}

export default App

