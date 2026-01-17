import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, PartyPopper } from 'lucide-react';

export default function ProcessingStatus({ outputFileName, onReady }: { outputFileName?: string; onReady?: (fileName: string) => void }) {
  const [progress, setProgress] = useState<number>(0);
  const [phase, setPhase] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!outputFileName) return;
    let stopped = false;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/status/${encodeURIComponent(outputFileName)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (stopped) return;
        setProgress(Number(json.progress ?? 0));
        setPhase(json.phase ?? json.status ?? null);
        setElapsedSeconds(json.elapsedSeconds ?? null);
        const wasReady = ready;
        setReady(Boolean(json.ready));
        setError(json.error ?? null);
        
        // Call onReady when it becomes ready
        if (!wasReady && json.ready && onReady) {
          onReady(json.actualFileName || outputFileName);
        }
      } catch (e) {
        // ignore transient errors
      }
    };

    // immediate fetch then every second
    fetchStatus();
    const id = setInterval(fetchStatus, 1000);
    return () => { stopped = true; clearInterval(id); };
  }, [outputFileName]);

  const formatTime = (s: number | null) => {
    if (s == null) return '--:--';
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (!outputFileName) return null;

  return (
    <div className="relative group animate-in fade-in duration-300">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 transition-all duration-500" />
      <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-white/10 rounded-2xl p-6 text-center">
        <div className="text-sm mb-4 font-semibold">
          <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {phase ? phase.charAt(0).toUpperCase() + phase.slice(1) : 'Processing...'}
          </span>
          <span className="text-slate-400 ml-2 flex items-center gap-1">
            • {ready ? <><CheckCircle className="w-4 h-4" /> Complete</> : error ? <><XCircle className="w-4 h-4" /> Error</> : <><Clock className="w-4 h-4" /> In Progress</>}
          </span>
        </div>

        <div className="w-full max-w-md mx-auto bg-slate-800/50 rounded-full h-4 overflow-hidden border border-slate-700/50 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="text-xs text-red-300 font-medium flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Processing Error
            </div>
            <div className="text-xs text-red-400 mt-1">
              {error}
            </div>
          </div>
        )}

        {ready && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="text-xs text-emerald-300 font-medium flex items-center gap-1">
              <PartyPopper className="w-4 h-4" />
              Video Ready!
            </div>
            <div className="text-xs text-emerald-400 mt-1">
              Your anime video has been created successfully
            </div>
          </div>
        )}
      </div>
    </div>
  );
}