"use client"

interface EndScreenProps {
  correctCount: number
  total: number
  missed: string[]
  onPlayAgain: () => void
}

function messageFor(percent: number): string {
  if (percent === 100) return "Perfect! You know Nepal inside out."
  if (percent >= 80) return "Excellent — almost the whole map!"
  if (percent >= 60) return "Great effort, you know your districts."
  if (percent >= 40) return "Not bad — room to grow."
  if (percent >= 20) return "A start. Time to brush up your geography."
  return "Give it another go — you'll get there!"
}

export function EndScreen({
  correctCount,
  total,
  missed,
  onPlayAgain,
}: EndScreenProps) {
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-lg">
      <h2 className="text-2xl font-bold text-card-foreground">Time&apos;s up!</h2>

      <div className="mt-4 flex items-baseline justify-center gap-2">
        <span className="font-mono text-5xl font-bold tabular-nums text-[#639922]">
          {correctCount}
        </span>
        <span className="text-2xl text-muted-foreground">/ {total}</span>
      </div>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {percent}% complete
      </p>

      <p className="mt-4 text-pretty text-base text-card-foreground">
        {messageFor(percent)}
      </p>

      {missed.length > 0 && (
        <div className="mt-5 text-left">
          <p className="mb-2 text-sm font-semibold text-card-foreground">
            You missed {missed.length}{" "}
            {missed.length === 1 ? "district" : "districts"}:
          </p>
          <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-muted/40 p-3">
            <ul className="flex flex-wrap gap-x-3 gap-y-1">
              {missed.map((name) => (
                <li key={name} className="text-sm text-[#D85A30]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onPlayAgain}
        className="mt-6 w-full rounded-md bg-[#639922] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#557f1d]"
      >
        Play again
      </button>
    </div>
  )
}
