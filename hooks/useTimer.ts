"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseTimerOptions {
  /** Starting number of seconds. Defaults to 900 (15 minutes). */
  initialSeconds?: number
  /** Called once when the timer reaches zero. */
  onExpire?: () => void
}

interface UseTimerResult {
  secondsLeft: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

export function useTimer({
  initialSeconds = 900,
  onExpire,
}: UseTimerOptions = {}): UseTimerResult {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep the latest onExpire without re-triggering the countdown effect.
  const onExpireRef = useRef(onExpire)
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clear()
          setIsRunning(false)
          onExpireRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clear
  }, [isRunning, clear])

  const start = useCallback(() => {
    setSecondsLeft((prev) => (prev > 0 ? prev : initialSeconds))
    setIsRunning(true)
  }, [initialSeconds])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    clear()
    setIsRunning(false)
    setSecondsLeft(initialSeconds)
  }, [clear, initialSeconds])

  return { secondsLeft, isRunning, start, pause, reset }
}
