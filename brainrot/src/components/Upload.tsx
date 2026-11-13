
import { useEffect, useRef, useState } from 'react'

interface AnalysisResult {
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
}

export default function Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  // Clean up temporary preview URLs
  useEffect(() => {
    if (!image) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(image)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [image])

  function handleFile(file?: File) {
    if (!file) return

    setError('')
    setResult(null)

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Upload a PNG, JPG, or WebP screenshot.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.')
      return
    }

    setImage(file)
  }

  async function uploadScreenshot() {
    if (!image) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed.')
      }

      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to the backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <div className="mx-auto grid w-full gap-5 text-white">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Drag and drop area */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files[0])
        }}
        className={`flex min-h-64 cursor-pointer flex-col items-center justify-center border-4 p-5 text-center transition ${
          isDragging
            ? 'border-yellow-400 bg-yellow-100 text-black'
            : 'border-white bg-zinc-900 hover:border-yellow-400'
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Selected screen-time screenshot"
            className="max-h-64 max-w-full object-contain"
          />
        ) : (
          <>
            <p className="text-xl font-bold">
              DROP YOUR SCREEN TIME
            </p>

            <p className="mt-2 text-sm text-zinc-300">
              Drag a screenshot here or click to browse
            </p>

            <p className="mt-2 text-xs text-zinc-400">
              PNG, JPG or WebP · Max 10 MB
            </p>
          </>
        )}
      </div>

      {/* Selected file */}
      {image && (
        <div className="flex items-center justify-between gap-3">
          <p className="break-all text-sm text-zinc-300">
            Selected: {image.name}
          </p>

          <button
            type="button"
            onClick={() => {
              setImage(null)
              setResult(null)
              setError('')
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            className="shrink-0 text-sm text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Analyze button */}
      <button
        type="button"
        disabled={!image || loading}
        onClick={uploadScreenshot}
        className="border-2 border-white p-3 font-bold transition hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'ANALYZING YOUR SCREEN TIME...' : 'ROAST MY SCREEN TIME'}
      </button>

      {/* Analysis results */}
      {result && (
        <div className="mt-4 space-y-5 border-2 border-yellow-400 p-5">

          <h2 className="text-xl font-black text-yellow-400">
            SCREEN TIME ANALYSIS
          </h2>

          {/* Brain Rot Score */}
          <div className="border-b border-zinc-700 pb-5">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Your Brain Rot Score
            </p>

            <p className="mt-2 text-6xl font-black text-yellow-400">
              {result.score.brain_rot_score}
              <span className="text-2xl text-zinc-500">/100</span>
            </p>
          </div>

          {/* Screen time details */}
          <div className="space-y-2">
            <p>
              Platform:{' '}
              <span className="font-bold uppercase">
                {result.screen_time.platform}
              </span>
            </p>

            <p>
              Total screen time:{' '}
              <span className="font-bold">
                {result.screen_time.total_screen_time_minutes == null
                  ? 'Unavailable'
                  : formatDuration(
                      result.screen_time.total_screen_time_minutes
                    )}
              </span>
            </p>

            <p>
              High-stimulation usage:{' '}
              <span className="font-bold">
                {formatDuration(result.score.high_stimulation_minutes)}
              </span>
            </p>
          </div>

          {/* Score breakdown */}
          <div className="space-y-3 border-t border-zinc-700 pt-4">
            <h3 className="font-bold text-yellow-400">
              SCORE BREAKDOWN
            </h3>

            {Object.entries(result.score.components).map(([name, value]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="capitalize">
                    {name.replaceAll('_', ' ')}
                  </span>
                  <span>{value} points</span>
                </div>

                <div className="h-2 overflow-hidden bg-zinc-800">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${Math.min(
                        (value /
                          (name === 'screen_time'
                            ? 40
                            : name === 'high_stimulation_usage'
                              ? 40
                              : 20)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Top apps */}
          <div className="space-y-2 border-t border-zinc-700 pt-4">
            <h3 className="font-bold text-yellow-400">
              TOP APPS
            </h3>

            {result.screen_time.apps.length > 0 ? (
              <ul className="space-y-2">
                {result.screen_time.apps.map((app, index) => (
                  <li
                    key={`${app.name}-${index}`}
                    className="flex justify-between gap-3 border-b border-zinc-800 pb-2 text-sm"
                  >
                    <span>{app.name}</span>
                    <span className="font-bold">
                      {formatDuration(app.duration_minutes)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">
                No app usage was extracted.
              </p>
            )}
          </div>

          {/* Scoring explanations */}
          <div className="space-y-2 border-t border-zinc-700 pt-4">
            <h3 className="font-bold text-yellow-400">
              WHY THIS SCORE?
            </h3>

            {result.score.explanations.map((item, index) => (
              <p key={index} className="text-sm text-zinc-300">
                • {item}
              </p>
            ))}
          </div>

          {/* Extraction warnings */}
          {result.screen_time.warnings?.length > 0 && (
            <div className="border-t border-zinc-700 pt-4">
              <h3 className="font-bold text-yellow-400">
                DATA WARNINGS
              </h3>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-200">
                {result.screen_time.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
