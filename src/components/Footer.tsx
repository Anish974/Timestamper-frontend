import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-slate-800/70 py-4 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-1 px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-300 text-sm font-semibold">Powered By</span>
          <img src="/AYUS%20Circular.png" alt="AYUS Logo" className="w-8 h-8 rounded-full" />
        </div>
        <span className="text-slate-400 text-xs">&copy; {new Date().getFullYear()} TimeStamper. All rights reserved.</span>
      </div>
    </footer>
  );
}
