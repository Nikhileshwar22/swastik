import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'

const MAX_FILES = 3
const ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }

export default function SpaceUploader({ images, onChange }) {
  const onDrop = useCallback(accepted => {
    const remaining = MAX_FILES - images.length
    const toAdd = accepted.slice(0, remaining).map(file =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    )
    onChange([...images, ...toAdd])
  }, [images, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: MAX_FILES - images.length,
    disabled: images.length >= MAX_FILES,
  })

  const remove = (index) => {
    const next = images.filter((_, i) => i !== index)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {/* Section heading */}
      <div>
        <h2 className="font-display text-2xl font-medium text-stone-900 mb-1">
          Tell us about your space
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Start with a photo of the room you want to transform. Upload up to 3 photos of your existing space.
        </p>
      </div>

      {/* Dropzone */}
      {images.length < MAX_FILES && (
        <div
          {...getRootProps()}
          className={clsx(
            'relative border-2 border-dashed transition-all duration-200 cursor-pointer group',
            isDragActive
              ? 'border-stone-800 bg-stone-100'
              : 'border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            {/* Upload icon */}
            <div className={clsx(
              'w-14 h-14 border flex items-center justify-center mb-5 transition-all duration-200',
              isDragActive ? 'border-stone-800 bg-stone-200' : 'border-stone-200 group-hover:border-stone-400'
            )}>
              <svg className={clsx('w-6 h-6 transition-colors', isDragActive ? 'text-stone-800' : 'text-stone-400 group-hover:text-stone-600')}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            {isDragActive ? (
              <p className="text-stone-800 font-medium text-sm tracking-wide">Drop your photos here</p>
            ) : (
              <>
                <p className="text-stone-700 font-medium text-sm mb-1">
                  <span className="underline underline-offset-2">Upload Your Room</span>
                  {' '}or drag &amp; drop
                </p>
                <p className="text-stone-400 text-xs tracking-wide">
                  JPG, PNG, WEBP · Up to {MAX_FILES} photos · Max 10MB each
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="label">Your Existing Space</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((file, i) => (
              <div key={i} className="relative group overflow-hidden bg-stone-100 aspect-video">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover img-zoom"
                  onLoad={() => URL.revokeObjectURL(file.preview)}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(i) }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white"
                    title="Remove"
                  >
                    <svg className="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Filename bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-stone-900/60 px-2 py-1">
                  <p className="text-white text-xs truncate">{file.name}</p>
                </div>
              </div>
            ))}

            {/* Add more slot */}
            {images.length < MAX_FILES && (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-stone-200 hover:border-stone-400 aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 group bg-white hover:bg-stone-50"
              >
                <input {...getInputProps()} />
                <svg className="w-5 h-5 text-stone-300 group-hover:text-stone-500 mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-xs text-stone-300 group-hover:text-stone-500 transition-colors">Add photo</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty hint */}
      {images.length === 0 && (
        <p className="text-xs text-stone-400 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          At least one room photo is required. This is the space that will be transformed.
        </p>
      )}
    </div>
  )
}
