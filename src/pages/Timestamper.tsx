import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import WaveSurfer from 'wavesurfer.js'
import { Music2, Keyboard, HelpCircle, Film, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioUpload } from '@/components/timestamper/AudioUpload'
import { WaveformPlayer } from '@/components/timestamper/WaveformPlayer'
import { FlagInput } from '@/components/timestamper/FlagInput'
import { TimestampList } from '@/components/timestamper/TimestampList'
import { ExportPanel } from '@/components/timestamper/ExportPanel'
import { exportTimestamps, getFileExtension, getMimeType } from '@/lib/exportFormats'
import { KeyboardShortcutsModal } from '@/components/timestamper/KeyboardShortcutsModal'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Timestamp } from '@/types/timestamp'
import { toast } from 'sonner'
import { supabaseClient } from '@/lib/supabaseClient'

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/m4a',
]
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

const PLAN_LIMITS: Record<string, number | null> = {
  Free: 3,
  Pro: 10,
  Business: 50,
  Unlimited: null,
}

const Home = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // TimeStamper states
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [timestamps, setTimestamps] = useState<Timestamp[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [exportFormat, setExportFormat] = useState<'txt' | 'csv' | 'json' | 'srt' | 'youtube'>('txt')

  const wavesurferRef = useRef<WaveSurfer | null>(null)

  // Plan + exports info
  const [planInfo, setPlanInfo] = useState<{
    plan: string
    used: number
    max: number | null
  } | null>(null)

  // Fetch subscription info when user changes
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setPlanInfo(null)
        return
      }

      const { data, error } = await supabaseClient
        .from('user_subscriptions')
        .select('plan, exports_used')
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        setPlanInfo(null)
        return
      }

      const max = PLAN_LIMITS[data.plan] ?? null

      setPlanInfo({
        plan: data.plan,
        used: data.exports_used,
        max,
      })
    }

    fetchSubscription()
  }, [user])

  // Helper: ensure auth + (optionally) plan for actions
  const requireAuth = useCallback(
    (opts?: { needPlan?: boolean }) => {
      if (!user) {
        toast.error('Please login to use this feature')
        navigate('/login')
        return false
      }
      if (opts?.needPlan) {
        if (!planInfo || !planInfo.plan) {
          toast.error('Please select a plan first')
          navigate('/pricing')
          return false
        }
      }
      return true
    },
    [user, planInfo, navigate]
  )

  // Handle file selection (auth + plan required)
  const handleFileSelect = useCallback(
    (file: File) => {
      if (!requireAuth({ needPlan: true })) return

      if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
        toast.error('Unsupported audio format. Please upload MP3, WAV, OGG, FLAC, AAC, or M4A.')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 100MB limit.')
        return
      }

      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      setFileName(file.name)
      setTimestamps([])
      setCurrentTime(0)
      setDuration(0)
      setIsReady(false)
    },
    [requireAuth]
  )

  // Handle flag/timestamp creation
  const handleFlag = useCallback(
    (label: string) => {
      if (!requireAuth({ needPlan: true })) return
      if (!isReady) {
        toast.error('Audio not ready')
        return
      }
      const newTimestamp: Timestamp = {
        id: Date.now().toString(),
        time: currentTime,
        label,
        createdAt: new Date(),
      }
      setTimestamps((prev) => [...prev, newTimestamp].sort((a, b) => a.time - b.time))
      toast.success('Timestamp added')
    },
    [currentTime, isReady, requireAuth]
  )

  // Handle seek
  const handleSeek = useCallback((time: number) => {
    const ws = wavesurferRef.current
    if (ws) {
      ws.seekTo(time / ws.getDuration())
    }
  }, [])

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (!requireAuth({ needPlan: false })) return

    const ws = wavesurferRef.current
    if (ws) {
      if (isPlaying) {
        ws.pause()
        setIsPlaying(false)
      } else {
        ws.play()
        setIsPlaying(true)
      }
    }
  }, [isPlaying, requireAuth])

  // Handle delete timestamp
  const handleDelete = useCallback((id: string) => {
    setTimestamps((prev) => prev.filter((ts) => ts.id !== id))
    toast.success('Timestamp deleted')
  }, [])

  // Handle adjust timestamp
  const handleAdjust = useCallback(
    (id: string, seconds: number) => {
      setTimestamps((prev) =>
        prev.map((ts) =>
          ts.id === id
            ? { ...ts, time: Math.max(0, Math.min(ts.time + seconds, duration)) }
            : ts
        )
      )
    },
    [duration]
  )

  // Handle update label
  const handleUpdateLabel = useCallback((id: string, label: string) => {
    setTimestamps((prev) => prev.map((ts) => (ts.id === id ? { ...ts, label } : ts)))
  }, [])

  // Handle skip forward
  const handleSkipForward = useCallback(
    (seconds: number) => {
      if (!requireAuth()) return
      const ws = wavesurferRef.current
      if (ws) {
        const newTime = Math.min(ws.getCurrentTime() + seconds, ws.getDuration())
        ws.seekTo(newTime / ws.getDuration())
      }
    },
    [requireAuth]
  )

  // Handle skip backward
  const handleSkipBackward = useCallback(
    (seconds: number) => {
      if (!requireAuth()) return
      const ws = wavesurferRef.current
      if (ws) {
        const newTime = Math.max(ws.getCurrentTime() - seconds, 0)
        ws.seekTo(newTime / ws.getDuration())
      }
    },
    [requireAuth]
  )

  // OLD local export handler is no longer used by shortcut; ExportPanel karega
  const handleExportDownload = useCallback(() => {
    if (!requireAuth({ needPlan: true })) return

    if (timestamps.length === 0) {
      toast.error('No timestamps to export')
      return
    }
    const content = exportTimestamps(timestamps, exportFormat, fileName)
    const blob = new Blob([content], { type: getMimeType(exportFormat) })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_timestamps.${getFileExtension(
      exportFormat
    )}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Timestamps exported!')
  }, [timestamps, exportFormat, fileName, requireAuth])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onFlag: () => handleFlag('Marker'),
    onSkipForward: handleSkipForward,
    onSkipBackward: handleSkipBackward,
    // Shortcut export abhi bhi local handler use kare; chahe to /api/export se wire kar sakta hai
    onExport: handleExportDownload,
    onShowHelp: () => setShowShortcuts(true),
    enabled: isReady,
  })

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-4xl py-8 px-4 mt-24">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              TimeStamper
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Flag important moments in your audio with visual precision
          </p>
          <div className="flex gap-3 flex-wrap justify-center mt-6">
            <Button
              onClick={() => navigate('/anime-editor')}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg"
              size="sm"
            >
              <Film className="w-4 h-4 mr-2" />
              Anime Editor
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!user) {
                  navigate('/login')
                } else {
                  setShowShortcuts(true)
                }
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Keyboard shortcuts
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 text-xs font-mono">?</kbd>
            </Button>
          </div>
        </header>

        {/* If not authenticated, show gentle CTA */}
        {!user && !loading && (
          <div className="mb-8 p-6 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
            <p className="text-slate-300 mb-4">
              Sign in to upload audio, add timestamps, and export your work.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-500 to-pink-500 hover:shadow-lg"
              >
                Sign In / Sign Up
              </Button>
              <Button
                onClick={() => navigate('/pricing')}
                variant="outline"
                className="border-slate-600 hover:bg-slate-800"
              >
                View Pricing
              </Button>
            </div>
          </div>
        )}

        {/* Plan badge + exports remaining */}
        {user && planInfo && (
          <div className="mb-6 inline-flex flex-col px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg text-sm font-semibold">
            <span>Plan: {planInfo.plan}</span>
            <span className="text-xs font-normal opacity-90">
              {planInfo.max === null
                ? `Exports used: ${planInfo.used} / ∞`
                : `Exports used: ${planInfo.used} / ${planInfo.max} • remaining ${Math.max(
                    0,
                    planInfo.max - planInfo.used
                  )}`}
            </span>
          </div>
        )}

        {/* Upload section */}
        {!audioUrl && (
          <div className="animate-scale-in">
            <AudioUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Main content when audio is loaded */}
        {audioUrl && (
          <div className="space-y-6">
            {/* Compact upload for replacing */}
            <div className="animate-fade-in">
              <AudioUpload onFileSelect={handleFileSelect} currentFile={fileName} />
            </div>

            {/* Waveform player */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <WaveformPlayer
                audioUrl={audioUrl}
                timestamps={timestamps}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setDuration}
                onReady={() => setIsReady(true)}
                wavesurferRef={wavesurferRef}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </div>

            {/* Flag input */}
            {isReady && (
              <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <FlagInput currentTime={currentTime} onFlag={handleFlag} />
              </div>
            )}

            {/* Two-column layout for timestamps and export */}
            <div className="grid md:grid-cols-3 gap-6">
              <div
                className="md:col-span-2 animate-slide-up"
                style={{ animationDelay: '300ms' }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <MapPin className="w-6 h-6" />
                  Timestamps
                  {timestamps.length > 0 && (
                    <span className="text-sm text-slate-400">({timestamps.length})</span>
                  )}
                </h2>
                <TimestampList
                  timestamps={timestamps}
                  onSeek={handleSeek}
                  onDelete={handleDelete}
                  onAdjust={handleAdjust}
                  onUpdateLabel={handleUpdateLabel}
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                <ExportPanel
                  timestamps={timestamps}
                  fileName={fileName}
                  selectedFormat={exportFormat}
                  setSelectedFormat={setExportFormat}
                  planInfo={planInfo}
                  onExportCountUpdated={(info) =>
                    setPlanInfo((prev) =>
                      prev
                        ? { ...prev, used: info.used, max: info.max, plan: info.plan }
                        : info
                    )
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Help button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (!user) {
              navigate('/login')
            } else {
              setShowShortcuts(true)
            }
          }}
          className="fixed bottom-6 right-6 bg-slate-800/50 backdrop-blur h-12 w-12 rounded-full hover:bg-slate-700/50"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Keyboard shortcuts modal */}
        <KeyboardShortcutsModal open={showShortcuts} onOpenChange={setShowShortcuts} />
      </div>
    </div>
  )
}

export default Home
