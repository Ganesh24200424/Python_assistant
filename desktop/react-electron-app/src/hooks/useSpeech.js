import { useState, useEffect, useCallback, useRef } from 'react'

const SPEECH_ERROR_MAX_RETRIES = 3
const SPEECH_SEND_DELAY_MS = 500

export const useSpeech = (onTranscript, { autoListen = false, voiceInterrupt = true } = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [errorRetry, setErrorRetry] = useState(0)
  const recognitionRef = useRef(null)
  const sendTimeoutRef = useRef(null)
  const pendingRef = useRef('')

  const initSpeech = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return null
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = !/Safari/i.test(navigator.userAgent)
    recognition.lang = 'en-US'

    recognition.onresult = (e) => {
      const last = e.results[e.results.length - 1]
      const text = last[0].transcript.trim()
      const isFinal = last.isFinal
      
      setTranscript(text)
      if (onTranscript) onTranscript(text, isFinal)
      
      if (isFinal && text) {
        pendingRef.current = text
        clearTimeout(sendTimeoutRef.current)
        sendTimeoutRef.current = setTimeout(() => {
          if (pendingRef.current) {
            // Trigger send via parent
            window.dispatchEvent(new CustomEvent('speech-final', { detail: pendingRef.current }))
            pendingRef.current = ''
          }
        }, SPEECH_SEND_DELAY_MS)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      setErrorRetry(prev => prev + 1)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (autoListen && errorRetry < SPEECH_ERROR_MAX_RETRIES) {
        setTimeout(startListening, 700)
      }
    }

    recognitionRef.current = recognition
    return recognition
  }, [onTranscript, autoListen, errorRetry])

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition || isListening) return
    
    setErrorRetry(0)
    setIsListening(true)
    setTranscript('')
    
    try {
      recognition.start()
    } catch (err) {
      console.warn('Speech recognition start failed:', err)
      setIsListening(false)
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    setIsListening(false)
    clearTimeout(sendTimeoutRef.current)
    pendingRef.current = ''
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  useEffect(() => {
    const recognition = initSpeech()
    return () => {
      if (recognition) recognition.stop()
    }
  }, [initSpeech])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    errorRetry,
    hasSpeech: !!recognitionRef.current
  }
}

