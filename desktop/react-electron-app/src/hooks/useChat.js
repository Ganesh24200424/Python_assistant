import { useState, useRef, useEffect, useCallback } from 'react'
import { useApi } from './useApi.js'

export const useChat = ({ sessionId: initialSessionId } = {}) => {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const { sendRawMessage, isLoading } = useApi()
  const sessionIdRef = useRef(initialSessionId)
  const abortControllerRef = useRef(null)

  const sendMessage = useCallback(async (text) => {
    if (isStreaming || isLoading || !text.trim()) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setIsStreaming(true)

    try {
      abortControllerRef.current = new AbortController()
      await sendRawMessage(text, sessionIdRef.current, abortControllerRef.current.signal)
    } catch (err) {
      console.error('Chat error:', err)
    } finally {
      setIsStreaming(false)
    }
  }, [isStreaming, isLoading, sendRawMessage])

  const clearChat = useCallback(() => {
    setMessages([])
    sessionIdRef.current = null
  }, [])

  return {
    messages,
    sendMessage,
    isStreaming: isStreaming || isLoading,
    clearChat,
    sessionId: sessionIdRef.current
  }
}

