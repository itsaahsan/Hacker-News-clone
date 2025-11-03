import { useEffect, useRef, useState } from 'react'

export function useAutoRefresh(refreshFunction, intervalMinutes = 5) {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false)
  const [nextRefreshIn, setNextRefreshIn] = useState(intervalMinutes * 60)
  const intervalRef = useRef(null)
  const countdownRef = useRef(null)

  useEffect(() => {
    if (isAutoRefreshEnabled) {
      // Start the main refresh interval
      intervalRef.current = setInterval(() => {
        refreshFunction()
        setNextRefreshIn(intervalMinutes * 60) // Reset countdown
      }, intervalMinutes * 60 * 1000)

      // Start the countdown
      countdownRef.current = setInterval(() => {
        setNextRefreshIn(prev => {
          if (prev <= 1) {
            return intervalMinutes * 60
          }
          return prev - 1
        })
      }, 1000)
    } else {
      // Clear intervals when auto-refresh is disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [isAutoRefreshEnabled, refreshFunction, intervalMinutes])

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(prev => !prev)
    if (!isAutoRefreshEnabled) {
      setNextRefreshIn(intervalMinutes * 60)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    nextRefreshIn: formatTime(nextRefreshIn),
    nextRefreshSeconds: nextRefreshIn
  }
}