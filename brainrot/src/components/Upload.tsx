
import { useRef, useState } from 'react'

export default function Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    message: string
    filename: string
    size_bytes: number
    content_type: string
  } | null>(null)

  function handleFile(file?: File) {
    if (!file) return

    setError('')

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Upload a PNG, JPG, or WebP screenshot.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.')
      return
    }

    if (preview) URL.revokeObjectURL(preview)

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  async function uploadScreenshot(){
    if (!image) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file',image)

      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed.')
      }

      setResult(data)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect to the backend")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="mx-auto grid w-full gap-5 text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

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
            <p className="text-xl font-bold">DROP YOUR SCREEN TIME</p>
            <p className="mt-2 text-sm text-zinc-300">
              Drag a screenshot here or click to browse
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              PNG, JPG or WebP · Max 10 MB
            </p>
          </>
        )}
      </div>

      {image && (
        <p className="break-all text-sm text-zinc-300">
          Selected: {image.name}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!image || loading}
        onClick={uploadScreenshot}
        className="border-2 border-white p-3 font-bold hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'UPLOADING...' : 'ROAST MY SCREEN TIME'}
      </button>
      {result && (
        <div className="mt-4 space-y-3 border border-yellow-400 p-4 text-white">
          <h2 className="text-xl font-bold text-yellow-400">
            SCREEN TIME ANALYSIS
          </h2>

          <p>Platform: {result.platform}</p>

          <p>
            Total screen time:{' '}
            {result.total_screen_time_minutes == null
              ? 'Unavailable'
              : `${Math.floor(result.total_screen_time_minutes / 60)}h ${
                  result.total_screen_time_minutes % 60
                }m`}
          </p>

          <h3 className="font-bold">Top Apps</h3>

          {result.apps.length > 0 ? (
            <ul>
              {result.apps.map((app, index) => (
                <li key={`${app.name}-${index}`}>
                  {app.name} — {Math.floor(app.duration_minutes / 60)}h{' '}
                  {app.duration_minutes % 60}m
                </li>
              ))}
            </ul>
          ) : (
            <p>No app usage was extracted.</p>
          )}

          {result.warnings.length > 0 && (
            <ul className="list-disc pl-5 text-yellow-200">
              {result.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
