import { useState, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Music2, Keyboard, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioUpload } from '@/components/timestamper/AudioUpload';
import { WaveformPlayer } from '@/components/timestamper/WaveformPlayer';
import { FlagInput } from '@/components/timestamper/FlagInput';
import { TimestampList } from '@/components/timestamper/TimestampList';
import { ExportPanel } from '@/components/timestamper/ExportPanel';
import { exportTimestamps, getFileExtension, getMimeType } from '@/lib/exportFormats';
import { KeyboardShortcutsModal } from '@/components/timestamper/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Timestamp } from '@/types/timestamp';
import { toast } from 'sonner';

const Index = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [exportFormat, setExportFormat] = useState<'txt' | 'csv' | 'json' | 'srt' | 'youtube'>('txt');

  const wavesurferRef = useRef<any>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setFileName(file.name);
    setTimestamps([]);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // Handle flag/timestamp creation
  const handleFlag = useCallback((label: string) => {
    if (!isReady) {
      toast.error('Audio not ready');
      return;
    }
    const newTimestamp: Timestamp = {
      id: Date.now().toString(),
      time: currentTime,
      label,
      createdAt: new Date(),
    };
    setTimestamps((prev) => [...prev, newTimestamp].sort((a, b) => a.time - b.time));
    toast.success('Timestamp added');
  }, [currentTime, isReady]);

  // Handle seek
  const handleSeek = useCallback((time: number) => {
    const ws = wavesurferRef.current;
    if (ws) {
      ws.seekTo(time / ws.getDuration());
    }
  }, []);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    const ws = wavesurferRef.current;
    if (ws) {
      if (isPlaying) {
        ws.pause();
        setIsPlaying(false);
      } else {
        ws.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  // Handle delete timestamp
  const handleDelete = useCallback((id: string) => {
    setTimestamps((prev) => prev.filter((ts) => ts.id !== id));
    toast.success('Timestamp deleted');
  }, []);

  // Handle adjust timestamp
  const handleAdjust = useCallback(
    (id: string, seconds: number) => {
      setTimestamps((prev) =>
        prev.map((ts) =>
          ts.id === id
            ? { ...ts, time: Math.max(0, Math.min(ts.time + seconds, duration)) }
            : ts
        )
      );
    },
    [duration]
  );

  // Handle update label
  const handleUpdateLabel = useCallback((id: string, label: string) => {
    setTimestamps((prev) =>
      prev.map((ts) => (ts.id === id ? { ...ts, label } : ts))
    );
  }, []);

  // Handle skip forward
  const handleSkipForward = useCallback((seconds: number) => {
    const ws = wavesurferRef.current;
    if (ws) {
      const newTime = Math.min(ws.getCurrentTime() + seconds, ws.getDuration());
      ws.seekTo(newTime / ws.getDuration());
    }
  }, []);

  // Handle skip backward
  const handleSkipBackward = useCallback((seconds: number) => {
    const ws = wavesurferRef.current;
    if (ws) {
      const newTime = Math.max(ws.getCurrentTime() - seconds, 0);
      ws.seekTo(newTime / ws.getDuration());
    }
  }, []);

  // Handle export download
  const handleExportDownload = useCallback(() => {
    if (timestamps.length === 0) {
      toast.error('No timestamps to export');
      return;
    }
    const content = exportTimestamps(timestamps, exportFormat, fileName);
    const blob = new Blob([content], { type: getMimeType(exportFormat) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_timestamps.${getFileExtension(exportFormat)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Timestamps exported!');
  }, [timestamps, exportFormat, fileName]);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onFlag: () => handleFlag('Marker'),
    onSkipForward: handleSkipForward,
    onSkipBackward: handleSkipBackward,
    onExport: handleExportDownload,
    onShowHelp: () => setShowShortcuts(true),
    enabled: isReady,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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

      <div className="relative z-10 container max-w-4xl py-8 px-4 mt-24">

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-pink-500/10 to-purple-500/10 border border-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            Manual Timestamping Tool
          </div>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Music2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              TimeStamper
            </h1>
          </div>
          <p className="text-slate-400 text-lg mb-6">
            Flag important moments in your audio with visual precision
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShortcuts(true)}
            className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-blue-500/30 hover:text-white hover:bg-slate-800/70 transition-all duration-300 hover:scale-105"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Keyboard shortcuts
            <kbd className="ml-2 px-1.5 py-0.5 rounded bg-slate-700/50 text-xs font-mono border border-slate-600/50">
              ?
            </kbd>
          </Button>
        </header>

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
                <div className="relative group mb-4">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-pink-500/20 rounded-2xl blur opacity-30"></div>
                  <div className="relative backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                      Timestamps
                    </h2>
                    {timestamps.length > 0 && (
                      <span className="ml-auto px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold">
                        {timestamps.length}
                      </span>
                    )}
                  </div>
                </div>
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
                />
              </div>
            </div>
          </div>
        )}

        {/* Help button */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShortcuts(true)}
              className="relative h-12 w-12 rounded-full backdrop-blur-2xl bg-slate-900/90 border border-white/10 hover:border-blue-500/50 hover:bg-slate-800/90 transition-all duration-300 hover:scale-110 shadow-xl"
            >
              <HelpCircle className="w-5 h-5 text-blue-400" />
            </Button>
          </div>
        </div>

        {/* Keyboard shortcuts modal */}
        <KeyboardShortcutsModal
          open={showShortcuts}
          onOpenChange={setShowShortcuts}
        />
      </div>
    </div>
  );
};

function formatTimeSimple(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export default Index;
