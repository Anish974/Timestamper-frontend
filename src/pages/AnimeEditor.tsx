import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AnimeEditor() {
  const { user } = useAuth()
  const [animeList, setAnimeList] = useState([])
  const [musicTracks, setMusicTracks] = useState<Record<string, any>>({})
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [selectedAnime, setSelectedAnime] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState('energy')
  const [customTimestamps, setCustomTimestamps] = useState<any>(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(30)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: string; message: string } | null>(null)
  const [progress, setProgress] = useState(0)
  const [outputSize, setOutputSize] = useState('landscape')
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [waveformReady, setWaveformReady] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const startHandleRef = useRef<HTMLDivElement>(null)
  const endHandleRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const drawDataRef = useRef<Float32Array | null>(null)

  const getApiUrl = () => {
    const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined
    const legacy = import.meta.env.VITE_API_URL as string | undefined
    const envUrl = envBase || legacy
    if (envUrl) return envUrl

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname.includes('timestamper.site') || hostname.includes('vercel.app')) {
        return 'https://timestamper-backend-o44d.onrender.com'
      }
      return 'http://localhost:5000'
    }

    return 'http://localhost:5000'
  }

  const API_BASE_URL = useMemo(() => getApiUrl(), [])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
    }
  }, [])

  useEffect(() => {
    if (selectedMusic && canvasRef.current) {
      drawWaveform()
    }
  }, [selectedMusic, waveformReady])

  useEffect(() => {
    if (selectedMusic && canvasRef.current) {
      drawWaveform()
    }
  }, [startTime, endTime, currentTime])

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (selectedMusic) {
          drawWaveform()
        }
      }, 250)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [selectedMusic])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(startTime)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [startTime])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !canvasRef.current || !selectedMusic) return

      const track = musicTracks[selectedMusic]
      if (!track?.duration) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const newTime = (x / rect.width) * track.duration

      if (isDragging === 'start') {
        setStartTime(Math.min(newTime, endTime - 0.1))
      } else if (isDragging === 'end') {
        setEndTime(Math.max(newTime, startTime + 0.1))
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, selectedMusic, musicTracks, startTime, endTime])

  async function loadData() {
    try {
      console.log('🔍 Loading data from:', API_BASE_URL)

      try {
        await fetch(`${API_BASE_URL}/api/health`, {
          signal: AbortSignal.timeout(5000),
        })
      } catch (err) {
        console.warn('⚠️ Backend might be cold-starting')
      }

      const musicResponse = await fetch(`${API_BASE_URL}/api/music-list`, {
        signal: AbortSignal.timeout(10000),
      })

      if (!musicResponse.ok) throw new Error(`Music API error: ${musicResponse.status}`)

      const musicData = await musicResponse.json()

      if (musicData.success && musicData.music?.length > 0) {
        const tracks: Record<string, any> = {}
        musicData.music.forEach((track: any) => {
          const trackUrl = track.path || track.url
          tracks[track.id] = {
            name: track.displayName,
            fileName: track.name,
            url: trackUrl,
            duration: null,
          }
        })
        setMusicTracks(tracks)
      } else {
        showStatus('error', '⚠️ No music files found.')
      }

      const videoResponse = await fetch(`${API_BASE_URL}/api/videos`, {
        signal: AbortSignal.timeout(10000),
      })

      if (!videoResponse.ok) throw new Error(`Video API error: ${videoResponse.status}`)

      const videoData = await videoResponse.json()

      if (videoData.animes && videoData.animes.length > 0) {
        const emojis = ['🎬', '⚔️', '🎭', '👹', '🦸', '💥', '🌟', '🔥', '⚡', '🎯']
        const animes = videoData.animes.map((anime: any, index: number) => ({
          id: anime.id,
          name: anime.name,
          videoCount: anime.videoCount,
          emoji: emojis[index % emojis.length],
        }))
        setAnimeList(animes)
      }
    } catch (err) {
      console.error('❌ Failed to load data:', err)
      showStatus('error', `❌ Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  function showStatus(type: string, message: string) {
    setStatusMsg({ type, message })
    setTimeout(() => setStatusMsg(null), 6000)
  }

  const handleMusicChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const musicId = e.target.value
    setSelectedMusic(musicId || null)
    setWaveformReady(false)

    if (!musicId) {
      setStartTime(0)
      setEndTime(30)
      audioBufferRef.current = null
      drawDataRef.current = null
      return
    }

    const track = musicTracks[musicId]
    if (!track || !audioRef.current) return

    const fullUrl = track.url.startsWith('http') ? track.url : `${API_BASE_URL}${track.url}`
    audioRef.current.src = fullUrl
    audioRef.current.currentTime = 0
    setIsPlaying(false)

    audioRef.current.onloadedmetadata = async () => {
      const duration = audioRef.current?.duration || 30
      track.duration = duration
      setStartTime(0)
      setEndTime(Math.min(30, duration))
      setCurrentTime(0)

      try {
        console.log('🎵 Loading audio data...')
        await loadAudioData(fullUrl)
        processWaveformData()
        setWaveformReady(true)
        console.log('✅ Real waveform ready!')
      } catch (err) {
        console.error('⚠️ Failed to process audio data:', err)
        setWaveformReady(true)
      }
    }

    audioRef.current.load()
  }

  async function loadAudioData(url: string) {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`)

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      audioBufferRef.current = audioBuffer
      console.log('✅ Audio decoded successfully')
    } catch (err) {
      console.error('❌ Error loading audio data:', err)
      audioBufferRef.current = null
      throw err
    }
  }

  const processWaveformData = useCallback(() => {
    if (!audioBufferRef.current || !canvasRef.current) return

    try {
      const canvas = canvasRef.current
      const channelData = audioBufferRef.current.getChannelData(0)
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(rect.width, 300)

      if (width <= 0) return

      const nrOfLinesPerPixel = 8
      const nrOfLines = Math.floor((nrOfLinesPerPixel * width) / 1)
      const sizeOfABucket = Math.floor(channelData.length / nrOfLines)

      if (sizeOfABucket <= 0) return

      const drawData = new Float32Array(nrOfLines)
      let maxDataValue = -1e4

      for (let bucketIndex = 0; bucketIndex < nrOfLines; bucketIndex++) {
        let min = 1.0
        let max = -1.0

        const start = Math.floor(bucketIndex * sizeOfABucket)
        const end = Math.floor((bucketIndex + 1) * sizeOfABucket)

        for (let i = start; i < end; i++) {
          const sample = channelData[i] || 0
          if (sample < min) min = sample
          if (sample > max) max = sample
        }

        const amplitude = Math.abs(max - min)
        drawData[bucketIndex] = amplitude

        if (amplitude > maxDataValue) {
          maxDataValue = amplitude
        }
      }

      if (maxDataValue > 0) {
        const multiplier = 1 / maxDataValue
        for (let i = 0; i < drawData.length; i++) {
          drawData[i] *= multiplier
        }
      }

      drawDataRef.current = drawData
      console.log('✅ Processed waveform data into', nrOfLines, 'buckets')
    } catch (err) {
      console.error('Error processing waveform:', err)
    }
  }, [])

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !selectedMusic) return

    const track = musicTracks[selectedMusic]
    if (!track) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let width = Math.max(rect.width, 300)
    let height = Math.max(rect.height, 100)

    if (width === 0 || isNaN(width)) width = canvas.offsetWidth || 300
    if (height === 0 || isNaN(height)) height = canvas.offsetHeight || 100

    canvas.width = width
    canvas.height = height

    const totalDuration = track.duration || 30

    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    // Draw waveform - ONLY real waveform when ready
    if (waveformReady && drawDataRef.current && drawDataRef.current.length > 0) {
      console.log('📊 Drawing REAL waveform')
      const drawData = drawDataRef.current
      ctx.strokeStyle = '#2dd4bf'
      ctx.lineWidth = 1.5
      ctx.beginPath()

      const lineGap = width / drawData.length

      for (let i = 0; i < drawData.length; i++) {
        const x = i * lineGap
        const y = drawData[i] * (height * 0.25)

        ctx.moveTo(x, height / 2 - y)
        ctx.lineTo(x, height / 2 + y)
      }

      ctx.stroke()
    } else if (!waveformReady) {
      // Show placeholder ONLY while loading
      console.log('📊 Drawing PLACEHOLDER waveform')
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2.5
      ctx.beginPath()

      for (let i = 0; i < width; i += 2) {
        const time = (i / width) * totalDuration
        const amplitude = 15 + Math.sin(time * 2.5) * 12 + Math.cos(time * 6) * 8
        const variation = (Math.sin(i * 0.03) + Math.cos(i * 0.05)) * 5
        const y = height / 2 + (amplitude + variation) * Math.sin(i * 0.08)

        if (i === 0) {
          ctx.moveTo(i, y)
        } else {
          ctx.lineTo(i, y)
        }
      }
      ctx.stroke()

      // Add loading indicator text
      ctx.fillStyle = 'rgba(16, 185, 129, 0.5)'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Loading waveform...', width / 2, height / 2 - 20)
    }

    // Draw selection overlay
    const startX = (startTime / totalDuration) * width
    const endX = (endTime / totalDuration) * width

    ctx.fillStyle = 'rgba(99, 102, 241, 0.25)'
    ctx.fillRect(startX, 0, Math.max(0, endX - startX), height)

    // Draw trim lines
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(startX, 0)
    ctx.lineTo(startX, height)
    ctx.moveTo(endX, 0)
    ctx.lineTo(endX, height)
    ctx.stroke()

    // Draw playback indicator
    if (currentTime > 0 && currentTime <= totalDuration) {
      const currentX = (currentTime / totalDuration) * width
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(currentX, 0)
      ctx.lineTo(currentX, height)
      ctx.stroke()
    }

    // Update trim handles
    if (startHandleRef.current) startHandleRef.current.style.left = startX + 'px'
    if (endHandleRef.current) endHandleRef.current.style.right = width - endX + 'px'
  }, [selectedMusic, musicTracks, startTime, endTime, currentTime, waveformReady])

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayClick = () => {
    if (!audioRef.current || !selectedMusic) return

    const track = musicTracks[selectedMusic]
    const totalDuration = track.duration || audioRef.current.duration || 30

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    audioRef.current.currentTime = Math.min(startTime, totalDuration)
    audioRef.current.play()
    setIsPlaying(true)

    const interval = setInterval(() => {
      if (!audioRef.current || audioRef.current.currentTime >= endTime) {
        audioRef.current?.pause()
        setIsPlaying(false)
        clearInterval(interval)
      }
    }, 100)
  }

  const handleStopClick = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = startTime
    setIsPlaying(false)
  }

  const handleResetForm = () => {
    setSelectedMusic(null)
    setSelectedAnime(null)
    setStartTime(0)
    setEndTime(30)
    setIsPlaying(false)
    setWaveformReady(false)
  }

  const handleDownloadClick = async () => {
    if (!selectedMusic || !selectedAnime) return

    // Check if user is logged in
    if (!user) {
      showStatus('error', '❌ Please login to create videos')
      return
    }

    try {
      setLoading(true)
      const track = musicTracks[selectedMusic]

      const payload = {
        musicPath: track.fileName,
        animeSelection: selectedAnime,
        startTime,
        endTime,
        clipCount: 10,
        bpm: 128,
        mode: selectedMode,
        outputSize,
        timestampsJson: selectedMode === 'manual' ? customTimestamps : undefined,
      }

      const response = await fetch(`${API_BASE_URL}/api/create-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
      }

      const result = await response.json()

      let attempts = 0
      const maxAttempts = 60

      const checkStatus = async () => {
        attempts++
        const statusResponse = await fetch(`${API_BASE_URL}/api/status/${result.outputFileName}`)

        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.status}`)
        }

        const statusData = await statusResponse.json()

        if (statusData.ready) {
          setLoading(false)
          showStatus('success', '✅ Video created successfully!')
          // Use actualFileName if available (for cropped videos)
          const finalFileName = statusData.actualFileName || result.outputFileName
          setVideoPreview(finalFileName)
        } else if (statusData.status === 'failed') {
          setLoading(false)
          showStatus('error', `❌ Failed: ${statusData.error}`)
        } else if (attempts >= maxAttempts) {
          setLoading(false)
          showStatus('error', '❌ Timeout')
        } else {
          setTimeout(checkStatus, 2000)
        }
      }

      setTimeout(checkStatus, 3000)
      simulateProgress()
    } catch (err: any) {
      setLoading(false)
      showStatus('error', `❌ Error: ${err.message}`)
    }
  }

  function simulateProgress() {
    let prog = 0
    const interval = setInterval(() => {
      prog += Math.random() * 35
      if (prog >= 100) prog = 100
      setProgress(prog)
      if (prog === 100) clearInterval(interval)
    }, 600)
  }

  const handleTimestampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string)
        if (Array.isArray(json.timestamps)) {
          setCustomTimestamps(json.timestamps)
          showStatus('success', `✅ Loaded ${json.timestamps.length} timestamps from JSON!`)
        } else {
          showStatus('error', '❌ Invalid JSON: missing timestamps array')
        }
      } catch (err) {
        showStatus('error', '❌ Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-4 overflow-hidden">
      {/* Advanced Animated Background - Login style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs with advanced animations */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Floating particles effect */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-40 right-40 w-3 h-3 bg-pink-400/40 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Anime Video Editor
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Transform your music into epic anime clips with AI-powered scene generation
          </p>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Step 1: Music */}
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-500" />
            <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
                  🎵
                </div>
                <h2 className="text-xl font-bold text-white">
                  Select Music
                </h2>
              </div>
              <div className="mb-4">
                <select
                  value={selectedMusic || ''}
                  onChange={handleMusicChange}
                  className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-800/50 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                >
                  <option value="">Choose a soundtrack...</option>
                  {Object.entries(musicTracks).map(([id, track]: [string, any]) => (
                    <option key={id} value={id}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Waveform Box - Always visible */}
              <div className="mt-6 bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                {selectedMusic ? (
                  <>
                    <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-t-xl border-b border-slate-700/50">
                      <div className="text-center flex-1">
                        <div className="text-xs text-slate-500 mb-0.5">Start</div>
                        <span className="font-semibold text-sm text-blue-400">{formatTime(startTime)}</span>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-xs text-slate-500 mb-0.5">Playing</div>
                        <span className="font-mono text-sm text-white">{formatTime(currentTime)}</span>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-xs text-slate-500 mb-0.5">End</div>
                        <span className="font-semibold text-sm text-pink-400">{formatTime(endTime)}</span>
                      </div>
                    </div>

                    <div className="relative bg-slate-900/50 h-32 overflow-hidden border-x border-slate-700/50">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-pointer block"
                        onClick={(e) => {
                          if (!selectedMusic) return
                          const track = musicTracks[selectedMusic]
                          if (!track?.duration) return
                          const rect = canvasRef.current?.getBoundingClientRect()
                          if (!rect) return
                          const x = e.clientX - rect.left
                          const newTime = (x / rect.width) * track.duration
                          if (audioRef.current) {
                            audioRef.current.currentTime = newTime
                          }
                        }}
                      />
                      <div
                        ref={startHandleRef}
                        className="absolute top-0 w-1 h-full bg-blue-500 cursor-ew-resize hover:w-2 transition-all shadow-lg z-10"
                        style={{ left: '0px' }}
                        onMouseDown={() => setIsDragging('start')}
                      />
                      <div
                        ref={endHandleRef}
                        className="absolute top-0 w-1 h-full bg-pink-500 cursor-ew-resize hover:w-2 transition-all shadow-lg z-10"
                        style={{ right: '0px' }}
                        onMouseDown={() => setIsDragging('end')}
                      />
                    </div>

                    <div className="p-3 bg-slate-800/30 rounded-b-xl border-t border-slate-700/50 text-center">
                      <span className="text-xs text-slate-500">Duration: </span>
                      <span className="font-bold text-sm text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                        {formatTime(endTime - startTime)}
                      </span>
                    </div>

                    <div className="flex gap-2 p-3 flex-wrap justify-center">
                      <button
                        onClick={handlePlayClick}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition font-semibold text-sm flex items-center gap-2"
                      >
                        <span>{isPlaying ? '⏸' : '▶'}</span>
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={handleStopClick}
                        className="px-5 py-2 bg-slate-700/80 text-slate-200 rounded-xl hover:bg-slate-600 transition font-semibold text-sm"
                      >
                        ⏹ Stop
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="relative bg-slate-900/50 h-32 rounded-xl overflow-hidden border border-slate-700/50 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <div className="text-2xl mb-1.5">🎵</div>
                      <div className="text-xs">Select music to see waveform</div>
                    </div>
                  </div>
                )}
              </div>

              <audio ref={audioRef} crossOrigin="anonymous" style={{ display: 'none' }} />
            </div>
          </div>

          {/* Step 2: Anime */}
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '100ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-500" />
            <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                  ⚔️
                </div>
                <h2 className="text-xl font-bold text-white">
                  Select Anime
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {animeList.map((anime) => (
                  <button
                    key={anime.id}
                    onClick={() => setSelectedAnime(anime.id)}
                  className={`p-3 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                    selectedAnime === anime.id
                      ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20 scale-105'
                      : 'border-slate-600/50 bg-slate-800/30 hover:border-pink-500/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-3xl mb-1.5">{anime.emoji}</div>
                    <div className="font-semibold text-xs text-slate-300">{anime.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Scene Change Mode */}
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '200ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-500" />
            <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-xl">
                  🎬
                </div>
                <h2 className="text-xl font-bold text-white">
                  Scene Mode
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {[
                  { id: 'manual', emoji: '📝', name: 'Manual', desc: 'Upload JSON timestamps' },
                  { id: 'energy', emoji: '⚡', name: 'Auto Detect', desc: 'AI-powered detection' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 transform hover:scale-105 ${
                    selectedMode === mode.id
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-105'
                      : 'border-slate-600/50 bg-slate-800/30 hover:border-purple-500/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{mode.emoji}</div>
                      <div>
                        <div className="font-semibold text-sm text-slate-300">{mode.name}</div>
                        <div className="text-xs text-slate-400">{mode.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedMode === 'manual' && (
                <div>
                  <label className="block px-4 py-3 bg-slate-800/50 rounded-xl border border-dashed border-slate-600/50 text-center cursor-pointer hover:border-purple-500 hover:bg-slate-800/70 transition">
                    <span className="text-sm text-slate-300 flex items-center justify-center gap-2">
                      <span>📤</span>
                      <span>Upload JSON</span>
                    </span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleTimestampUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Output Size */}
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '300ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-500" />
            <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-xl">
                  📐
                </div>
                <h2 className="text-xl font-bold text-white">
                  Output Format
                </h2>
              </div>
              <select
                value={outputSize}
                onChange={(e) => setOutputSize(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-800/50 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              >
                <option value="landscape">🖥️ YouTube (16:9)</option>
                <option value="reels">📱 Reels/Shorts (9:16)</option>
                <option value="square">⬜ Square (1:1)</option>
                <option value="tiktok">🎵 TikTok (9:16)</option>
                <option value="instagram">📷 Instagram (4:5)</option>
                <option value="original">✨ Original</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS - Full Width Below */}
        <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-500" />
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6">
          {!user && (
            <div className="mb-4 backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-yellow-400 font-semibold text-sm">
                🔒 Please login to create videos
              </p>
            </div>
          )}
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleResetForm}
              className="px-6 py-2.5 bg-slate-700/80 text-slate-200 rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-semibold text-sm"
            >
              🔄 Reset
            </button>
            <button
              onClick={handleDownloadClick}
              disabled={!selectedMusic || !selectedAnime || loading || !user}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
            >
              ✨ Create Video
            </button>
          </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="relative group animate-in fade-in duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 transition-all duration-500" />
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-white/10 rounded-2xl p-8 text-center">
            <div className="inline-block w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="font-semibold text-slate-300 mb-4">Creating your anime video...</p>
            <div className="w-full max-w-md mx-auto bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          </div>
        )}

        {/* STATUS MESSAGE */}
        {statusMsg && (
          <div
            className={`backdrop-blur-xl rounded-xl border p-4 text-sm ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {statusMsg.message}
          </div>
        )}

        {/* VIDEO PREVIEW */}
        {videoPreview && (
          <div className="relative group animate-in fade-in duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-2xl blur opacity-30 transition-all duration-500" />
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <video
              controls
              src={`${API_BASE_URL}/api/download/${videoPreview}`}
              className="w-full rounded-xl shadow-2xl max-w-2xl mx-auto mb-6"
            />
            <a
              href={`${API_BASE_URL}/api/download/${videoPreview}`}
              download
              className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-semibold text-sm"
            >
              ⬇️ Download Video
            </a>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}
