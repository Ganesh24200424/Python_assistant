import { useState, useCallback, useRef, useEffect } from 'react'

export const useCamera = () => {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setStream(null)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return null

    return new Promise((resolve) => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!canvas) return resolve(null)

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(null)

      ctx.drawImage(video, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1])
    })
  }, [])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  return {
    stream,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureFrame,
    error,
    isActive: !!stream
  }
}

