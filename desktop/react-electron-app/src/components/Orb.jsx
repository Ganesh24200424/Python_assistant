import { useEffect, useRef } from 'react'
import OrbRenderer from '../utils/orb.js'

const Orb = () => {
  const containerRef = useRef(null)
  const orbRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && !orbRef.current) {
      orbRef.current = new OrbRenderer(containerRef.current, {
        hue: 0,
        hoverIntensity: 0.3,
        backgroundColor: [0.02, 0.02, 0.06]
      })
    }

    return () => {
      if (orbRef.current) {
        orbRef.current.destroy()
        orbRef.current = null
      }
    }
  }, [])

  const setActive = (active) => {
    if (orbRef.current) {
      orbRef.current.setActive(active)
    }
  }

  return (
    <div 
      id="orb-container" 
      ref={containerRef}
      className="orb-container"
      data-active={orbRef.current?.targetHover > 0.5}
    />
  )
}

export default Orb

