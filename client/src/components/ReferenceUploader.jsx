import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'

const MAX_FILES = 5
const ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }

const EXAMPLE_SOURCES = [
  'Pinterest references',
  'Instagram saves',
  'Magazine clippings',
  'Furniture you love',
  'Lighting inspiration',
  'Color references',
]

export default function ReferenceUploader({ images, onChange }) {
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
    if (images[index]?.preview) URL.revokeObjectURL(images[index].preview)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div>
        <h2 className="font-display text-2xl font-medium text-stone-900 mb-1">
          What inspires you?
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Upload reference images that represent the look, feel, materials, colors and atmosphere you want.
          These guide the AI's design direction.
        </p>
      </div>

      {/* Example sources */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_SOURCES.map(s => (
          <span key={s} className="text-xs text-stone-400 bg-stone-100 px-3 py-1.5 tracking-wide">
            {s}
          </span>
        ))}
      </div>

      {/* Visual distinction between YOUR SPACE and YOUR INSPIRATION */}
      <div className="flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-stone-100" />
        <span className="text-xs tracking-[0.2em] uppercase font-semibold text-stone-400">
          Your Inspiration
        </span>
        <div className="h-px flex-1 bg-stone-100" />
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
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className={clsx(
              'w-14 h-14 border flex items-center justify-center mb-5 transition-all duration-200',
              isDragActive ? 'border-stone-800 bg-stone-200' : 'border-stone-200 group-hover:border-stone-400'
            )}>
              <svg className={clsx('w-6 h-6 transition-colors', isDragActive ? 'text-stone-800' : 'text-stone-400 group-hover:text-stone-600')}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            {isDragActive ? (
              <p className="text-stone-800 font-medium text-sm">Drop your references here</p>
            ) : (
              <>
                <p className="text-stone-700 font-medium text-sm mb-1">
                  <span className="underline underline-offset-2">Add Reference Images</span>
                  {' '}or drag &amp; drop
                </p>
                <p className="text-stone-400 text-xs tracking-wide">
                  JPG, PNG, WEBP · Up to {MAX_FILES} images · {images.length}/{MAX_FILES} added
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reference image gallery */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="label m-0">Reference Images ({images.length}/{MAX_FILES})</p>
            {images.length < MAX_FILES && (
              <button
                {...getRootProps()}
                type="button"
                onClick={e => e.stopPropagation()}
                className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-2 transition-colors flex items-center gap-1"
              >
                <input {...getInputProps()} />
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add another reference
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {images.map((file, i) => (
              <div key={i} className="relative group overflow-hidden bg-stone-100 aspect-square">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover img-zoom"
                  onLoad={() => URL.revokeObjectURL(file.preview)}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-all duration-300 flex items-end justify-between p-2">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs truncate max-w-[70%] transition-opacity">
                    {file.name}
                  </span>
                  <button
                    onClick={() => remove(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 bg-white/90 flex items-center justify-center hover:bg-white flex-shrink-0"
                    title="Remove"
                  >
                    <svg className="w-3 h-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Number badge */}
                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-stone-900/60 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{i + 1}</span>
                </div>
              </div>
            ))}

            {/* Add slot */}
            {images.length < MAX_FILES && (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-stone-200 hover:border-stone-400 aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors group bg-white hover:bg-stone-50"
              >
                <input {...getInputProps()} />
                <svg className="w-5 h-5 text-stone-300 group-hover:text-stone-500 mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-xs text-stone-300 group-hover:text-stone-500 transition-colors text-center px-1">Add</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper note */}
      {images.length === 0 && (
        <p className="text-xs text-stone-400 flex items-start gap-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Reference images are optional but strongly recommended. The more context you provide, the better the AI can match your vision.
        </p>
      )}
    </div>
  )
}
