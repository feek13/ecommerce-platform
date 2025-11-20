import { WarningIcon, LightningIcon, InfoIcon } from '@/components/icons/Icons'

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  type = 'info'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const typeStyles = {
    danger: {
      Icon: WarningIcon,
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      button: 'bg-destructive hover:bg-destructive/90 focus:ring-destructive/30'
    },
    warning: {
      Icon: LightningIcon,
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-600 dark:text-yellow-500',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500/30 text-white'
    },
    info: {
      Icon: InfoIcon,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      button: 'bg-primary hover:bg-primary/90 focus:ring-primary/30'
    }
  }

  const style = typeStyles[type]
  const IconComponent = style.Icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card text-card-foreground rounded-2xl shadow-2xl max-w-md w-full animate-scale-in border">
        {/* Icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className={`w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center`}>
            <IconComponent className={style.iconColor} size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 text-center">
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-xl font-medium transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 text-primary-foreground rounded-xl font-medium transition focus:outline-none focus:ring-4 ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
