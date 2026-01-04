import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsProps {
  onPlayPause: () => void;
  onFlag: () => void;
  onSkipForward: (seconds: number) => void;
  onSkipBackward: (seconds: number) => void;
  onExport: () => void;
  onShowHelp: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onPlayPause,
  onFlag,
  onSkipForward,
  onSkipBackward,
  onExport,
  onShowHelp,
  enabled = true,
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          onPlayPause();
          break;
        case 'f':
        case 'enter':
          if (!isCtrlOrCmd) {
            e.preventDefault();
            onFlag();
          }
          break;
        case 'arrowright':
          e.preventDefault();
          onSkipForward(e.shiftKey ? 10 : 5);
          break;
        case 'arrowleft':
          e.preventDefault();
          onSkipBackward(e.shiftKey ? 10 : 5);
          break;
        case 'e':
          if (isCtrlOrCmd) {
            e.preventDefault();
            onExport();
          }
          break;
        case '?':
          e.preventDefault();
          onShowHelp();
          break;
      }
    },
    [enabled, onPlayPause, onFlag, onSkipForward, onSkipBackward, onExport, onShowHelp]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export const shortcuts = [
  { key: 'Space', action: 'Play / Pause' },
  { key: 'F', action: 'Flag timestamp' },
  { key: '←', action: 'Skip back 5s' },
  { key: '→', action: 'Skip forward 5s' },
  { key: 'Shift + ←', action: 'Skip back 10s' },
  { key: 'Shift + →', action: 'Skip forward 10s' },
  { key: 'Ctrl/⌘ + E', action: 'Export' },
  { key: '?', action: 'Show shortcuts' },
];
