'use client'

import { useState, useRef } from 'react'

const MAX_IMAGES = 5
const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploadProps {
  images: File[]
  onChange: (files: File[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return '仅支持 JPG、PNG、WEBP 格式'
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `文件大小不能超过 ${MAX_SIZE_MB}MB`
    }
    return null
  }

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files)
    if (images.length + newImages.length > MAX_IMAGES) {
      alert(`最多上传 ${MAX_IMAGES} 张图片`)
      return
    }

    for (const file of newImages) {
      const error = validateFile(file)
      if (error) {
        alert(error)
        return
      }
    }

    // Create previews
    const newPreviews: string[] = []
    newImages.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === newImages.length) {
          setPreviews((prev) => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    onChange([...images, ...newImages])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    onChange(newImages)
    setPreviews(newPreviews)
  }

  return (
    <div>
      {/* Drag-drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition ${
          dragActive
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="text-3xl md:text-4xl mb-2">📸</div>
        <p className="text-sm md:text-base text-gray-600 mb-1">
          拖拽图片到这里，或点击选择文件
        </p>
        <p className="text-xs text-gray-500">
          最多 {MAX_IMAGES} 张，每张不超过 {MAX_SIZE_MB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`预览 ${index + 1}`}
                className="w-full h-20 object-cover rounded border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition font-bold text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
