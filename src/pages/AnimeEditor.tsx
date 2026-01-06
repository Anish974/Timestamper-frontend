import React, { useState, useEffect, useRef } from 'react'

export default function AnimeEditor() {
  const [animeList, setAnimeList] = useState([])
  const [musicTracks, setMusicTracks] = useState<Record<string, any>>({})
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [selectedAnime, setSelectedAnime] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState('energy')
  const [customTimestamps, setCustomTimestamps] = useState<any>(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: string; message: string } | null>(null)
  const [progress, setProgress] = useState(0)
  const [outputSize, setOutputSize] = useState('landscape')
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const startHandleRef = useRef<HTMLDivElement>(null)
  const endHandleRef = useRef<HTMLDivElement>(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const musicResponse = await fetch('http://localhost:3000/api/music-list')
      const musicData = await musicResponse.json()

      if (musicData.success && musicData.music.length > 0) {
        const tracks: Record<string, any> = {}
        musicData.music.forEach((track: any) => {
          tracks[track.id] = {
            name: track.displayName,
            fileName: track.name,
            url: `http://localhost:3000${track.path}`,
            duration: null,
          }
        })
        setMusicTracks(tracks)
      } else {
        showStatus('error', '⚠️ No music files found.')
      }

      const videoResponse = await fetch('http://localhost:3000/api/videos')
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
      console.error('Failed to load data:', err)
      showStatus('error', '❌ Failed to connect to backend.')
    }
  }

  function showStatus(type: string, message: string) {
    setStatusMsg({ type, message })
    setTimeout(() => setStatusMsg(null), 6000)
  }

  const handleMusicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const musicId = e.target.value
    setSelectedMusic(musicId || null)

    if (!musicId) {
      setStartTime(0)
      setEndTime(30)
      return
    }

    const track = musicTracks[musicId]
    if (!track || !audioRef.current) return

    audioRef.current.src = track.url
    audioRef.current.currentTime = 0
    setIsPlaying(false)

    audioRef.current.onloadedmetadata = () => {
      const duration = audioRef.current?.duration || 30
      track.duration = duration
      setStartTime(0)
      setEndTime(Math.min(30, duration))
      drawWaveform()
    }

    audioRef.current.load()
  }

  function drawWaveform() {
    const canvas = canvasRef.current
    if (!canvas || !selectedMusic) return

    const track = musicTracks[selectedMusic]
    if (!track || !track.duration) return

    const totalDuration = track.duration
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#2a9d8f'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < width; i++) {
      const time = (i / width) * totalDuration
      const y = height / 2 + Math.sin(time * 2) * 25 + Math.random() * 8
      if (i === 0) ctx.moveTo(i, y)
      else ctx.lineTo(i, y)
    }
    ctx.stroke()

    const startX = (startTime / totalDuration) * width
    const endX = (endTime / totalDuration) * width

    ctx.fillStyle = 'rgba(42, 157, 143, 0.13)'
    ctx.fillRect(startX, 0, Math.max(0, endX - startX), height)

    updateTrimHandles(width, totalDuration)
  }

  function updateTrimHandles(width: number, totalDuration: number) {
    const startX = (startTime / totalDuration) * width
    const endX = (endTime / totalDuration) * width

    if (startHandleRef.current) startHandleRef.current.style.left = startX + 'px'
    if (endHandleRef.current) endHandleRef.current.style.right = width - endX + 'px'
  }

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
  }

  const handleDownloadClick = async () => {
    if (!selectedMusic || !selectedAnime) return

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

      const response = await fetch('http://localhost:3000/api/create-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to create video')

      const result = await response.json()

      let attempts = 0
      const maxAttempts = 60

      const checkStatus = async () => {
        attempts++
        const statusResponse = await fetch(`http://localhost:3000/api/status/${result.outputFileName}`)
        const statusData = await statusResponse.json()

        if (statusData.ready) {
          setLoading(false)
          showStatus('success', '✅ Video created successfully!')
          setVideoPreview(result.outputFileName)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-12 px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              🎬 Anime Video Editor
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Create epic anime clips synced to your favorite music
          </p>
        </div>

        <div className="space-y-6">
          {/* MUSIC SECTION */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text mb-6 flex items-center gap-3">
              <span>🎵</span> Step 1: Select Music
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Choose your soundtrack:
              </label>
              <select
                value={selectedMusic || ''}
                onChange={handleMusicChange}
                className="w-full px-4 py-3 border border-slate-600 bg-slate-800/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              >
                <option value="">-- Select a music track --</option>
                {Object.entries(musicTracks).map(([id, track]: [string, any]) => (
                  <option key={id} value={id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedMusic && (
              <div className="mt-6 bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-slate-800/50 border-b border-slate-700">
                  <div className="text-center flex-1">
                    <span className="font-bold text-base text-blue-400">{formatTime(startTime)}</span>
                  </div>
                  <div className="text-center flex-1 text-slate-400">
                    <span className="text-sm">{formatTime(0)}</span>
                  </div>
                  <div className="text-center flex-1">
                    <span className="font-bold text-base text-pink-400">{formatTime(endTime)}</span>
                  </div>
                </div>

                <div className="relative bg-slate-900/50 h-32">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full cursor-pointer"
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
                    className="absolute top-0 w-1 h-full bg-blue-500 cursor-ew-resize hover:w-2 transition-all shadow-lg"
                    style={{ left: '0px' }}
                  />
                  <div
                    ref={endHandleRef}
                    className="absolute top-0 w-1 h-full bg-pink-500 cursor-ew-resize hover:w-2 transition-all shadow-lg"
                    style={{ right: '0px' }}
                  />
                </div>

                <div className="p-4 bg-slate-800/50 border-t border-slate-700 text-center font-bold text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text">
                  Selected: {formatTime(endTime - startTime)}
                </div>

                <div className="flex gap-3 p-4 flex-wrap justify-center">
                  <button
                    onClick={handlePlayClick}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition font-semibold flex items-center gap-2"
                  >
                    <span>{isPlaying ? '⏸' : '▶'}</span>
                    {isPlaying ? 'Pause' : 'Play Trimmed'}
                  </button>
                  <button
                    onClick={handleStopClick}
                    className="px-6 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition font-semibold"
                  >
                    ⏹ Stop
                  </button>
                </div>
              </div>
            )}

            <audio ref={audioRef} crossOrigin="anonymous" style={{ display: 'none' }} />
          </div>

          {/* ANIME SECTION */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text mb-6 flex items-center gap-3">
              <span>⚔️</span> Step 2: Select Anime
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {animeList.map((anime) => (
                <button
                  key={anime.id}
                  onClick={() => setSelectedAnime(anime.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAnime === anime.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-4xl mb-2">{anime.emoji}</div>
                  <div className="font-semibold text-sm text-slate-300">{anime.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* MODE SECTION */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text mb-6 flex items-center gap-3">
              <span>🎬</span> Step 3: Scene Change Mode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { id: 'manual', emoji: '📝', name: 'Manual Timestamp', desc: 'Upload your own JSON timestamps' },
                { id: 'energy', emoji: '⚡', name: 'Energy Based', desc: 'Based on audio energy/loudness' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    selectedMode === mode.id
                      ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                      : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{mode.emoji}</div>
                  <div className="font-semibold text-slate-300 mb-1">{mode.name}</div>
                  <div className="text-sm text-slate-400">{mode.desc}</div>
                </button>
              ))}
            </div>

            {selectedMode === 'manual' && (
              <div className="mt-4">
                <label className="block px-6 py-3 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-600 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800/70 transition">
                  <span className="font-semibold text-slate-300">📤 Upload Timestamps JSON</span>
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

          {/* OUTPUT SIZE */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Output Size:</label>
            <select
              value={outputSize}
              onChange={(e) => setOutputSize(e.target.value)}
              className="w-full px-4 py-3 border border-slate-600 bg-slate-800/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="landscape">YouTube (16:9) Landscape</option>
              <option value="reels">Reels/Shorts (9:16)</option>
              <option value="square">Square (1:1)</option>
              <option value="tiktok">TikTok (9:16)</option>
              <option value="instagram">Instagram (4:5)</option>
              <option value="original">Original</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 flex-wrap justify-center pt-4">
            <button
              onClick={handleResetForm}
              className="px-8 py-3 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition font-semibold"
            >
              🔄 Reset Form
            </button>
            <button
              onClick={handleDownloadClick}
              disabled={!selectedMusic || !selectedAnime || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎬 Create & Download Video
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-8 text-center">
              <div className="inline-block w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="font-semibold text-slate-300 mb-4">Creating your anime video...</p>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* STATUS MESSAGE */}
          {statusMsg && (
            <div
              className={`backdrop-blur-xl rounded-xl border-l-4 p-4 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-l-emerald-500 text-emerald-300'
                  : 'bg-red-500/10 border-l-red-500 text-red-300'
              }`}
            >
              {statusMsg.message}
            </div>
          )}

          {/* VIDEO PREVIEW */}
          {videoPreview && (
            <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-8 text-center">
              <video
                controls
                src={`http://localhost:3000/api/download/${videoPreview}`}
                className="w-full rounded-lg shadow-2xl max-w-2xl mx-auto mb-6"
              />
              <a
                href={`http://localhost:3000/api/download/${videoPreview}`}
                download
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition font-semibold"
              >
                ⬇️ Download Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
