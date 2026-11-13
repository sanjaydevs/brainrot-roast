
import { useState } from 'react'
import Hero from './components/Hero'
import Upload from './components/Upload'
import Results from './components/Results'

import './App.css'

export interface AnalysisResult {
  screen_time: {
    platform: string
    total_screen_time_minutes: number | null
    apps: {
      name: string
      duration_minutes: number
    }[]
    warnings: string[]
  }
  score: {
    brain_rot_score: number
    components: {
      screen_time: number
      high_stimulation_usage: number
      app_concentration: number
    }
    high_stimulation_minutes: number
    explanations: string[]
  }
  roast: {
    headline: string
    roast: string[]
    insights: string[]
  }
}

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  function resetAnalysis() {
    setResult(null)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#090909] text-white">

      <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 sm:px-10 lg:px-16">

        {/* Brand strip */}
        <div className="flex items-center justify-between border-b border-zinc-800 py-6">
          <p className="text-xl font-black tracking-tight sm:text-2xl">
            BRAIN ROT<span className="text-yellow-400">®</span>
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
            Screen Time Intelligence / 001
          </p>
        </div>

        {result ? (
          /* Full-width results page */
          <Results
            result={result}
            onReset={resetAnalysis}
          />
        ) : (
          /* Landing page */
          <div className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">

            <section className="w-full">
              <Hero />
            </section>

            <section className="w-full">
              <Upload onAnalysisComplete={setResult} />
            </section>

          </div>
        )}

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-zinc-800 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>NO FILTERS. NO MERCY.</p>
          <p>IOS / ANDROID · EST. 2026</p>
        </footer>

      </main>
    </div>
  )
}

export default App
