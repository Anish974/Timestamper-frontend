import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-slate-800/70 py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-sm font-semibold">Powered By</span>
            <img src="/AYUS%20Circular.png" alt="AYUS Logo" className="w-10 h-10 rounded-full" />
          </div>
          <span className="text-slate-400 text-xs">&copy; {new Date().getFullYear()} TimeStamper. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
