import { Timestamp, ExportFormat } from '@/types/timestamp';
import { formatTime, formatTimeWithMs } from './formatTime';

export function exportTimestamps(
  timestamps: Timestamp[],
  format: ExportFormat,
  fileName: string
): string {
  const sorted = [...timestamps].sort((a, b) => a.time - b.time);

  switch (format) {
    case 'txt':
      return exportAsTxt(sorted, fileName);
    case 'csv':
      return exportAsCsv(sorted);
    case 'json':
      return exportAsJson(sorted, fileName);
    case 'srt':
      return exportAsSrt(sorted);
    case 'youtube':
      return exportAsYouTube(sorted);
    default:
      return exportAsTxt(sorted, fileName);
  }
}

function exportAsTxt(timestamps: Timestamp[], fileName: string): string {
  let content = `Timestamps for: ${fileName}\n`;
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `${'='.repeat(50)}\n\n`;

  timestamps.forEach((ts, index) => {
    content += `${index + 1}. ${formatTime(ts.time)} - ${ts.label}\n`;
  });

  return content;
}

function exportAsCsv(timestamps: Timestamp[]): string {
  let content = 'Index,Time,Time (seconds),Label\n';
  
  timestamps.forEach((ts, index) => {
    const escapedLabel = `"${ts.label.replace(/"/g, '""')}"`;
    content += `${index + 1},${formatTime(ts.time)},${ts.time.toFixed(2)},${escapedLabel}\n`;
  });

  return content;
}

function exportAsJson(timestamps: Timestamp[], fileName: string): string {
  const data = {
    fileName,
    generatedAt: new Date().toISOString(),
    timestamps: timestamps.map((ts, index) => ({
      index: index + 1,
      time: formatTime(ts.time),
      timeSeconds: parseFloat(ts.time.toFixed(2)),
      label: ts.label,
    })),
  };

  return JSON.stringify(data, null, 2);
}

function exportAsSrt(timestamps: Timestamp[]): string {
  let content = '';

  timestamps.forEach((ts, index) => {
    const startTime = formatTimeWithMs(ts.time);
    const endTime = formatTimeWithMs(ts.time + 3); // Default 3 second duration
    
    content += `${index + 1}\n`;
    content += `${startTime} --> ${endTime}\n`;
    content += `${ts.label}\n\n`;
  });

  return content;
}

function exportAsYouTube(timestamps: Timestamp[]): string {
  let content = '📌 Timestamps / Chapters:\n\n';

  timestamps.forEach((ts) => {
    content += `${formatTime(ts.time)} ${ts.label}\n`;
  });

  return content;
}

export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'txt':
      return 'txt';
    case 'csv':
      return 'csv';
    case 'json':
      return 'json';
    case 'srt':
      return 'srt';
    case 'youtube':
      return 'txt';
    default:
      return 'txt';
  }
}

export function getMimeType(format: ExportFormat): string {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    default:
      return 'text/plain';
  }
}
