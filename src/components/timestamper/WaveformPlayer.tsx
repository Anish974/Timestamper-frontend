import { useEffect } from 'react';
import { useRef, useState } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/formatTime';
import { Timestamp } from '@/types/timestamp';
import { cn } from '@/lib/utils';

interface WaveformPlayerProps {
  audioUrl: string;
  timestamps: Timestamp[];
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onReady: () => void;
  wavesurferRef: React.MutableRefObject<any>;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function WaveformPlayer({
  audioUrl,
  timestamps,
  onTimeUpdate,
  onDurationChange,
  onReady,
  wavesurferRef,
  isPlaying,
  onPlayPause,
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: audioUrl,
    waveColor: 'hsl(280 60% 50% / 0.5)',
    progressColor: 'hsl(280 100% 70%)',
    cursorColor: 'hsl(320 100% 65%)',
    cursorWidth: 2,
    barWidth: 3,
    barGap: 2,
    barRadius: 3,
    height: 100,
    normalize: true,
  });

  // Setup wavesurfer event listeners
  useEffect(() => {
    if (!wavesurfer) return;

    const handleReady = () => {
      const dur = wavesurfer.getDuration();
      setDuration(dur);
      onDurationChange(dur);
      onReady();
      wavesurferRef.current = wavesurfer;
    };

    const handleAudioProcess = () => {
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(time);
      onTimeUpdate(time);
    };

    const handleSeeking = () => {
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(time);
      onTimeUpdate(time);
    };

    wavesurfer.on('ready', handleReady);
    wavesurfer.on('audioprocess', handleAudioProcess);
    wavesurfer.on('seeking', handleSeeking);

    return () => {
      wavesurfer.un('ready', handleReady);
      wavesurfer.un('audioprocess', handleAudioProcess);
      wavesurfer.un('seeking', handleSeeking);
    };
  }, [wavesurfer, onTimeUpdate, onDurationChange, onReady, wavesurferRef]);

  // Sync external isPlaying prop
  useEffect(() => {
    if (!wavesurfer) return;
    if (isPlaying && !wavesurfer.isPlaying()) {
      wavesurfer.play();
    } else if (!isPlaying && wavesurfer.isPlaying()) {
      wavesurfer.pause();
    }

    // Keep time updated every 100ms as fallback
    const id = setInterval(() => {
      if (!wavesurfer || !wavesurfer.isPlaying()) return;
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(time);
      onTimeUpdate(time);
    }, 100);

    return () => clearInterval(id);
  }, [isPlaying, wavesurfer, onTimeUpdate]);

  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
    onPlayPause();
  };

  const skip = (seconds: number) => {
    if (wavesurfer) {
      const newTime = Math.max(0, currentTime + seconds);
      wavesurfer.seekTo(newTime / duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0];
    setVolume(vol);
    setIsMuted(vol === 0);
    if (wavesurfer) {
      wavesurfer.setVolume(vol);
    }
  };

  const toggleMute = () => {
    if (wavesurfer) {
      if (isMuted) {
        wavesurfer.setVolume(volume || 1);
        setIsMuted(false);
      } else {
        wavesurfer.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handlePlaybackRateChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(nextRate);
    }
  };

  const seekToTimestamp = (time: number) => {
    if (wavesurfer && duration && duration > 0) {
      wavesurfer.seekTo(time / duration);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-all duration-500" />
      <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        
        {/* Waveform */}
        <div className="relative">
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xl bg-slate-900/80 rounded-lg z-10 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={containerRef} className="rounded-lg overflow-hidden border border-slate-700/30" />

        {/* Timestamp markers */}
        {duration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
            {timestamps.map((ts) => (
              <button
                key={ts.id}
                onClick={() => seekToTimestamp(ts.time)}
                className="absolute top-0 h-full w-1 bg-accent/80 hover:bg-accent pointer-events-auto transition-colors cursor-pointer"
                style={{ left: `${(ts.time / duration) * 100}%` }}
                title={`${formatTime(ts.time)} - ${ts.label}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Time display */}
      <div className="flex justify-between items-center text-sm backdrop-blur-xl bg-slate-800/30 px-4 py-2 rounded-full border border-slate-700/50">
        <span className="font-mono text-blue-400 font-semibold">{formatTime(currentTime)}</span>
        <span className="font-mono text-slate-400">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-5)}
            className="h-10 w-10 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/70 text-slate-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 rounded-full"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-all duration-300" />
            <Button
              onClick={handlePlayPause}
              className={cn(
                'relative h-14 w-14 rounded-full transition-all duration-300 transform hover:scale-110',
                'bg-gradient-to-br from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600',
                'shadow-xl',
                isPlaying && 'shadow-blue-500/50'
              )}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(5)}
            className="h-10 w-10 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/70 text-slate-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 rounded-full"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Playback speed */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlaybackRateChange}
            className="text-xs font-mono min-w-[50px] backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-800/70 text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110 rounded-full"
          >
            {playbackRate}x
          </Button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 hover:border-pink-500/30 hover:bg-slate-800/70 text-slate-300 hover:text-pink-400 transition-all duration-300 transform hover:scale-110 rounded-full"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              className="w-20"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
    </div>
    </div>
  );
}
