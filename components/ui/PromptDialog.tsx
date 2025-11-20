import { useState } from 'react'
import { EditIcon } from '@/components/icons/Icons'

type PromptDialogProps = {
  isOpen: boolean
  title: string
  message: string
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  cancelText?: string
  onConfirm: (value: string) => void
  onCancel: () => void
}

export default function PromptDialog({
  isOpen,
  title,
  message,
  placeholder = '请输入...',
  defaultValue = '',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue)

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(value)
    setValue('')
  }

  const handleCancel = () => {
    onCancel()
    setValue('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card text-card-foreground rounded-2xl shadow-2xl max-w-md w-full animate-scale-in border">
        {/* Icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <EditIcon className="text-primary" size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-6">
          <h3 className="text-xl font-bold mb-3 text-center">{title}</h3>
          <p className="text-muted-foreground mb-4 text-center">{message}</p>

          {/* Input */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-xl font-medium transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition focus:outline-none focus:ring-4 focus:ring-primary/30"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
