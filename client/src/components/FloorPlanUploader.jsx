import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
}

export default function FloorPlanUploader({ file, onChange }) {
  const [expanded, setExpanded] = useState(false)

  const onDrop = useCallback(accepted => {
    if (accepted[0]) {
      const f = accepted[0]
      Object.assign(f, {
        preview: f.type !== 'application/pdf' ? URL.createObjectURL(f) : null,
      })
      onChange(f)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: 1,
    disabled: !!file,
  })

  const remove = () => {
    if (file?.preview) URL.revokeObjectURL(file.preview)
    onChange(null)
  }

  return (
    <div className="border border-stone-100 bg-white">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-stone-700 tracking-wide">Floor Plan</span>
          <span className="text-xs text-stone-400 tracking-wider uppercase bg-stone-100 px-2 py-0.5">Optional</span>
          {file && (
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 flex items-center gap-1">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Uploaded
            </span>
          )}
        </div>
        <svg
          className={clsx('w-4 h-4 text-stone-400 transition-transform duration-200', expanded && 'rotate-180')}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-100">
          <p className="text-xs text-stone-400 leading-relaxed mb-4 mt-4">
            Upload a floor plan if you have one. This helps understand the spatial layout and dimensions of your space.
          </p>

          {!file ? (
            <div
              {...getRootProps()}
              className={clsx(
                'border-2 border-dashed transition-all duration-200 cursor-pointer',
                isDragActive
                  ? 'border-stone-800 bg-stone-50'
                  : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50'
              )}
            >
              <input {...getInputProps()} />
              <div className="flex items-center gap-4 p-5">
                <div className={clsx(
                  'w-10 h-10 border flex-shrink-0 flex items-center justify-center transition-colors',
                  isDragActive ? 'border-stone-800' : 'border-stone-200'
                )}>
                  <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-600 font-medium">Upload Floor Plan</p>
                  <p className="text-xs text-stone-400 mt-0.5">JPG, PNG or PDF · Max 10MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-stone-50 border border-stone-100">
              {/* Preview for images */}
              {file.preview ? (
                <img
                  src={file.preview}
                  alt="Floor plan"
                  className="w-16 h-16 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{file.name}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {(file.size / 1024 / 1024).toFixed(1)} MB · {file.type === 'application/pdf' ? 'PDF' : 'Image'}
                </p>
              </div>
              <button
                onClick={remove}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
