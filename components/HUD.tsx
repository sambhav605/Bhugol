"use client"

import { useState } from "react"

interface HUDProps {
  correctCount: number
  total: number
  secondsLeft: number
  isOver: boolean
  onGiveUp: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function HUD({
  correctCount,
  total,
  secondsLeft,
  isOver,
  onGiveUp,
}: HUDProps) {
  const [confirmingGiveUp, setConfirmingGiveUp] = useState(false)
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const lowTime = secondsLeft <= 60

  const handleConfirmGiveUp = () => {
    onGiveUp()
    setConfirmingGiveUp(false)
  }

  const handleCancelGiveUp = () => {
    setConfirmingGiveUp(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        {/* Score */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
            {correctCount}
          </span>
          <span className="text-lg text-muted-foreground">/ {total}</span>
        </div>

        {/* Timer */}
        <div
          className={`font-mono text-3xl font-bold tabular-nums ${
            lowTime ? "text-destructive" : "text-foreground"
          }`}
          aria-label={`Time remaining ${formatTime(secondsLeft)}`}
          role="timer"
        >
          {formatTime(secondsLeft)}
        </div>

        {/* Give up / Confirmation */}
        <div className="flex items-center gap-2">
          {confirmingGiveUp ? (
            <>
              <span className="text-sm text-muted-foreground">Are you sure?</span>
              <button
                type="button"
                onClick={handleConfirmGiveUp}
                className="rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Yes, give up
              </button>
              <button
                type="button"
                onClick={handleCancelGiveUp}
                className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingGiveUp(true)}
              disabled={isOver}
              className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Give up
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Districts guessed"
      >
        <div
          className="h-full rounded-full bg-[#639922] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
