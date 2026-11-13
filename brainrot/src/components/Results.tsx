
import type { AnalysisResult } from '../App'
import { getScoreTheme } from '../utils/scoreTheme'

interface ResultsProps {
  result: AnalysisResult
  onReset: () => void
}

export default function Results({ result, onReset }: ResultsProps) {
  const { screen_time, score, roast } = result

  const scoreValue = score.brain_rot_score
  const theme = getScoreTheme(scoreValue)

  const clampedScore = Math.min(Math.max(scoreValue, 0), 100)

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) return `${remainingMinutes}m`
    return `${hours}h ${remainingMinutes}m`
  }

  const topAppDuration = Math.max(
    ...screen_time.apps.map((app) => app.duration_minutes),
    1
  )

  return (
    <div className="w-full flex-1 py-10 sm:py-14">

      {/* Report heading */}
      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-zinc-800 pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            Report / Complete
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-6xl">
            THE DAMAGE<span className="text-yellow-400">.</span>
          </h1>
        </div>

        <div className="flex gap-3">
          <span className="border border-zinc-700 px-3 py-2 text-xs font-bold uppercase">
            {screen_time.platform}
          </span>

          <span className="border border-zinc-700 px-3 py-2 text-xs font-bold uppercase">
            BR / 001
          </span>
        </div>
      </div>

      {/* Score and Roast */}
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">

        {/* Score card */}
        <div
          className={`flex flex-col justify-between border-2 ${theme.borderClass} bg-[#141414] p-6 sm:p-8`}
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              Brain Rot Score
            </p>

            <p className={`mt-3 text-sm font-black uppercase tracking-widest ${theme.textClass}`}>
              {theme.label}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              {theme.description}
            </p>
          </div>

          <div className="mt-10">
            <div className="flex items-end gap-2">
              <span
                className={`text-8xl font-black leading-none tracking-[-0.08em] sm:text-9xl ${theme.textClass}`}
              >
                {scoreValue}
              </span>

              <span className="pb-2 text-2xl font-black text-zinc-600">
                /100
              </span>
            </div>

            <div className="mt-6 h-3 border border-zinc-700 bg-zinc-900">
              <div
                className={`h-full ${theme.bgClass} transition-all duration-700`}
                style={{ width: `${clampedScore}%` }}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                Screen time
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {screen_time.total_screen_time_minutes == null
                  ? '--'
                  : formatDuration(screen_time.total_screen_time_minutes)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                High-stimulation
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {formatDuration(score.high_stimulation_minutes)}
              </p>
            </div>
          </div>
        </div>

        {/* Roast card */}
        <div className="flex flex-col border-2 border-yellow-400 bg-yellow-400 p-6 text-black sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.25em]">
              The Roast / 001
            </p>

            <span className="text-2xl font-black">!</span>
          </div>

          <h2 className="mt-8 text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
            {roast.headline}
          </h2>

          <div className="mt-7 space-y-5 border-t border-black/30 pt-6">
            {roast.roast.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm font-medium leading-relaxed sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-auto border-t border-black/30 pt-5 text-[10px] font-black uppercase tracking-[0.2em]">
            NO OFFENCE. ACTUALLY, SOME OFFENCE.
          </p>
        </div>
      </div>

      {/* Insights */}
      <section className="mt-10">
        <div className="mb-5 border-b border-zinc-800 pb-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            002 / Usage insights
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
            WHAT YOUR USAGE SAYS.
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {roast.insights.map((insight, index) => (
            <div
              key={index}
              className="border border-zinc-700 bg-[#111111] p-5"
            >
              <p className="text-2xl font-black text-yellow-400">
                0{index + 1}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* App usage */}
      <section className="mt-12">
        <div className="mb-5 border-b border-zinc-800 pb-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            003 / App breakdown
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
            WHERE YOUR TIME WENT.
          </h2>
        </div>

        <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
          {screen_time.apps.map((app, index) => (
            <div key={`${app.name}-${index}`}>
              <div className="mb-2 flex justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-zinc-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="text-sm font-bold">
                    {app.name}
                  </span>
                </div>

                <span className="text-sm font-black text-yellow-400">
                  {formatDuration(app.duration_minutes)}
                </span>
              </div>

              <div className="ml-7 h-2 bg-zinc-800">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${Math.min(
                      (app.duration_minutes / topAppDuration) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Score breakdown */}
      <section className="mt-12">
        <div className="mb-5 border-b border-zinc-800 pb-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            004 / Scoring system
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
            WHY THIS SCORE?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(score.components).map(([name, value]) => {
            const maximum = name === 'app_concentration' ? 20 : 40

            return (
              <div key={name} className="border border-zinc-700 p-4">
                <p className="text-xs font-bold uppercase text-zinc-400">
                  {name.replaceAll('_', ' ')}
                </p>

                <p className="mt-3 text-3xl font-black">
                  {value.toFixed(1)}
                  <span className="text-sm text-zinc-500"> / {maximum}</span>
                </p>

                <div className="mt-4 h-2 bg-zinc-800">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${Math.min(
                        Math.max((value / maximum) * 100, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 space-y-2 border-l-2 border-yellow-400 pl-4">
          {score.explanations.map((item, index) => (
            <p key={index} className="text-sm leading-relaxed text-zinc-400">
              {item}
            </p>
          ))}
        </div>
      </section>

      {/* Warnings */}
      {screen_time.warnings.length > 0 && (
        <section className="mt-10 border-l-4 border-yellow-400 bg-yellow-400/5 p-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-yellow-400">
            DATA NOTES
          </h3>

          <ul className="mt-3 space-y-2">
            {screen_time.warnings.map((warning, index) => (
              <li key={index} className="text-sm text-zinc-400">
                — {warning}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Reset */}
      <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-zinc-800 pt-8 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            End of report
          </p>

          <p className="mt-2 text-xl font-black uppercase">
            READY FOR ANOTHER HUMBLING?
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-between gap-8 bg-yellow-400 px-6 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300 sm:w-auto"
        >
          ANALYZE AGAIN
          <span className="text-xl">→</span>
        </button>
      </div>

    </div>
  )
}
