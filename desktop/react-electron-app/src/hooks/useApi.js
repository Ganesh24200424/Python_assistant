import { useState, useCallback } from 'react'

// API base URL - works for dev and Electron
const API = import.meta.env.DEV ? 'http://localhost:8000' : window.location.origin

export const useApi = () => {
  const [sessionId, setSessionId] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(5000) })
      const data = await res.json()
      return data.status === 'healthy' || data.status === 'degraded'
    } catch {
      return false
    }
  }, [])

  const sendMessage = useCallback(async (message, { imgBase64, tts = true } = {}) => {
    setIsStreaming(true)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 300000)

      const formData = new FormData()
      formData.append('message', message)
      formData.append('session_id', sessionId || '')
      formData.append('tts', tts.toString())
      if (imgBase64) formData.append('imgbase64', imgBase64)

      const res = await fetch(`${API}/chat/jarvis/stream`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.session_id) setSessionId(data.session_id)
              // Handle activity, actions, search_results, audio chunks here
              if (data.done) break
            } catch {}
          }
        }
      }
    } catch (err) {
      console.error('API Error:', err)
    } finally {
      setIsStreaming(false)
    }
  }, [sessionId])

  return { sessionId, setSessionId, isStreaming, checkHealth, sendMessage }
}

