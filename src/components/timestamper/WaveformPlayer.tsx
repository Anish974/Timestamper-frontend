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
    <div className="glass-card p-6 space-y-4">
      {/* Waveform */}
      <div className="relative">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={containerRef} className="rounded-lg overflow-hidden" />

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
      <div className="flex justify-between items-center text-sm">
        <span className="timestamp-mono text-foreground">{formatTime(currentTime)}</span>
        <span className="timestamp-mono text-muted-foreground">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-5)}
            className="glass-button h-10 w-10"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={handlePlayPause}
            className={cn(
              'h-14 w-14 rounded-full transition-all duration-300',
              'bg-gradient-to-br from-primary to-accent hover:opacity-90',
              isPlaying && 'glow-effect'
            )}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Play className="w-6 h-6 text-primary-foreground ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(5)}
            className="glass-button h-10 w-10"
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
            className="glass-button text-xs font-mono min-w-[50px]"
          >
            {playbackRate}x
          </Button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="glass-button h-8 w-8"
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
    </div>
  );
}
