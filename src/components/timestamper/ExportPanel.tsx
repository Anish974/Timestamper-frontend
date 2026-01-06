import { useState } from 'react'
import {
  Download,
  Copy,
  Check,
  FileText,
  FileJson,
  FileSpreadsheet,
  Subtitles,
  Youtube,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Timestamp, ExportFormat } from '@/types/timestamp'
import { exportTimestamps, getFileExtension, getMimeType } from '@/lib/exportFormats'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { supabaseClient } from '@/lib/supabaseClient'

interface ExportPanelProps {
  timestamps: Timestamp[]
  fileName: string
  selectedFormat: ExportFormat
  setSelectedFormat: (f: ExportFormat) => void
  // optional: Home page pass karega, Index nahi karega
  planInfo?: {
    plan: string
    used: number
    max: number | null
  } | null
  onExportCountUpdated?: (info: {
    plan: string
    used: number
    max: number | null
  }) => void
}

const formats: {
  id: ExportFormat
  label: string
  icon: React.ReactNode
  description: string
}[] = [
  { id: 'txt', label: 'TXT', icon: <FileText className="w-4 h-4" />, description: 'Simple text list' },
  { id: 'csv', label: 'CSV', icon: <FileSpreadsheet className="w-4 h-4" />, description: 'Spreadsheet' },
  { id: 'json', label: 'JSON', icon: <FileJson className="w-4 h-4" />, description: 'Developer format' },
  { id: 'srt', label: 'SRT', icon: <Subtitles className="w-4 h-4" />, description: 'Subtitles' },
  { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" />, description: 'Video chapters' },
]

export function ExportPanel({
  timestamps,
  fileName,
  selectedFormat,
  setSelectedFormat,
  planInfo,
  onExportCountUpdated,
}: ExportPanelProps) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (timestamps.length === 0) {
      toast.error('No timestamps to export')
      return
    }

    try {
      setLoading(true)

      // Agar Supabase configured hai (Home use case)
      const { data, error: userError } = await supabaseClient.auth.getUser()
      if (userError || !data?.user) {
        // Index jaise public page ke liye graceful fallback
        if (userError?.message && userError.message !== 'Auth session missing!') {
          toast.error('Please login again to export')
          setLoading(false)
          return
        }
      }

      if (data?.user) {
        const userId = data.user.id

        const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://timestamper-backend-o44d.onrender.com')
        const res = await fetch(`${API_URL}/api/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })

        if (!res.ok) {
          let msg = 'Export limit reached or server error'
          try {
            const body = await res.json()
            if (body?.error) msg = body.error
          } catch {
            // ignore
          }
          toast.error(msg)
          setLoading(false)
          return
        }

        const info = await res.json()
        if (onExportCountUpdated) {
          onExportCountUpdated({
            plan: info.plan,
            used: info.used,
            max: info.max ?? null,
          })
        }
      }

      // Actual file download client‑side
      const content = exportTimestamps(timestamps, selectedFormat, fileName)
      const blob = new Blob([content], { type: getMimeType(selectedFormat) })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName.replace(/\.[^/.]+$/, '')}_timestamps.${getFileExtension(
        selectedFormat
      )}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Timestamps exported!')
    } catch (err) {
      console.error('handleDownload error:', err)
      toast.error('Something went wrong during export')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (timestamps.length === 0) {
      toast.error('No timestamps to copy')
      return
    }

    const content = exportTimestamps(timestamps, selectedFormat, fileName)
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Download className="w-5 h-5 text-primary" />
        Export Timestamps
      </h3>

      {/* Format selection */}
      <div className="grid grid-cols-5 gap-2">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => setSelectedFormat(format.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300',
              'border hover:border-primary/50',
              selectedFormat === format.id
                ? 'bg-primary/20 border-primary glow-effect'
                : 'bg-muted/30 border-border/50'
            )}
          >
            <div
              className={cn(
                'p-2 rounded-lg',
                selectedFormat === format.id ? 'bg-primary/30' : 'bg-muted/50'
              )}
            >
              {format.icon}
            </div>
            <span className="text-xs font-medium">{format.label}</span>
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {formats.find((f) => f.id === selectedFormat)?.description}
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={timestamps.length === 0 || loading}
          className={cn(
            'flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading ? 'Exporting...' : 'Download'}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={timestamps.length === 0}
          className="glass-button px-6"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Exports remaining – only when planInfo available (Home) */}
      {planInfo && (
        <p className="text-xs text-muted-foreground text-center">
          {planInfo.max === null
            ? `Plan ${planInfo.plan}: Unlimited exports (used ${planInfo.used})`
            : `Plan ${planInfo.plan}: ${planInfo.used}/${planInfo.max} exports used • remaining ${Math.max(
                0,
                planInfo.max - planInfo.used
              )}`}
        </p>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Press{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">
          Ctrl
        </kbd>
        +
        <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">
          E
        </kbd>{' '}
        to export
      </p>
    </div>
  )
}
