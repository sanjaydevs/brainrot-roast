
import { useEffect, useRef, useState } from 'react'
import type { AnalysisResult } from '../App'

interface UploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void
}

const loadingMessages = [
  'COUNTING YOUR BAD DECISIONS...',
  'ANALYZING YOUR DIGITAL HABITS...',
  'PREPARING YOUR HUMBLING...',
  'YOUR PHONE IS NOT IMPRESSED...',
]

export default function Upload({ onAnalysisComplete }: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(0)

  // Create and clean up image preview URL
  useEffect(() => {
    if (!image) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(image)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [image])

  // Rotate loading messages during analysis
  useEffect(() => {
    if (!loading) {
      setLoadingMessage(0)
      return
    }

    const interval = window.setInterval(() => {
      setLoadingMessage((previous) =>
        (previous + 1) % loadingMessages.length
      )
    }, 2500)

    return () => window.clearInterval(interval)
  }, [loading])

  function handleFile(file?: File) {
    if (!file) return

    setError('')

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('INVALID FILE. Upload a PNG, JPG, or WebP screenshot.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('FILE TOO LARGE. Maximum allowed size is 10 MB.')
      return
    }

    setImage(file)
  }

  function removeImage() {
    setImage(null)
    setError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function uploadScreenshot() {
    if (!image || loading) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed.')
      }

      onAnalysisComplete(data as AnalysisResult)
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

  return (
    <div className="w-full space-y-6 text-white">

      {/* Upload panel */}
      <div className="border-2 border-zinc-700 bg-[#111111]">

        {/* Panel heading */}
        <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-4">
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            INPUT / 001
          </p>

          <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">
            {image ? 'FILE LOADED' : 'AWAITING INPUT'}
          </span>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />

        {/* Drag and drop area */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload screen time screenshot"
          aria-disabled={loading}
          onClick={() => {
            if (!loading) fileInputRef.current?.click()
          }}
          onKeyDown={(e) => {
            if (!loading && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            if (!loading) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)

            if (!loading) {
              handleFile(e.dataTransfer.files[0])
            }
          }}
          className={`relative mx-3 my-3 flex min-h-[280px] flex-col items-center justify-center border-2 border-dashed p-6 text-center transition-all duration-200 ${
            isDragging
              ? 'border-yellow-400 bg-yellow-400 text-black'
              : 'cursor-pointer border-zinc-700 bg-[#090909] hover:border-yellow-400'
          } ${loading ? 'cursor-wait opacity-70' : ''}`}
        >
          {preview ? (
            <div className="w-full space-y-4">
              <img
                src={preview}
                alt="Selected screen-time screenshot"
                className="mx-auto max-h-64 max-w-full object-contain"
              />

              <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                SCREENSHOT READY
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center border-2 border-yellow-400 text-3xl font-black text-yellow-400">
                +
              </div>

              <h3 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                {isDragging ? 'DROP IT HERE.' : 'DROP YOUR SCREEN TIME.'}
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
                Drag your screenshot into this box or click anywhere to browse your files.
              </p>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                PNG / JPG / WEBP · MAX 10 MB
              </p>
            </>
          )}
        </div>

        {/* Selected file information */}
        {image && (
          <div className="mx-3 mb-3 flex flex-wrap items-center justify-between gap-3 border border-zinc-700 bg-[#090909] p-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Selected file
              </p>

              <p className="mt-1 break-all text-sm font-bold">
                {image.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {(image.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={removeImage}
              className="shrink-0 border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-40"
            >
              Remove ×
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mx-3 mb-3 border-l-4 border-red-500 bg-red-950/30 p-4"
          >
            <p className="text-xs font-black uppercase tracking-widest text-red-400">
              ERROR / ANALYSIS FAILED
            </p>

            <p className="mt-2 text-sm text-red-200">
              {error}
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            className="mx-3 mb-3 border border-yellow-400 bg-yellow-400/5 p-5"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
                PROCESSING
              </p>

              <span className="h-2 w-2 animate-pulse bg-yellow-400" />
            </div>

            <p className="mt-4 text-lg font-black uppercase sm:text-xl">
              {loadingMessages[loadingMessage]}
            </p>

            <div className="mt-4 h-1 overflow-hidden bg-zinc-800">
              <div className="h-full w-1/3 animate-pulse bg-yellow-400" />
            </div>

            <p className="mt-3 text-[10px] uppercase tracking-widest text-zinc-500">
              This may take a few seconds.
            </p>
          </div>
        )}

        {/* Analyze button */}
        <div className="p-3 pt-0">
          <button
            type="button"
            disabled={!image || loading}
            onClick={uploadScreenshot}
            className="group flex w-full items-center justify-between bg-yellow-400 px-5 py-5 text-left text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            <span className="text-sm font-black uppercase tracking-wider sm:text-base">
              {loading ? 'ANALYZING...' : 'ROAST MY SCREEN TIME'}
            </span>

            <span className="text-2xl font-black transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
