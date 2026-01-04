export interface Timestamp {
  id: string;
  time: number;
  label: string;
  color?: string;
  createdAt?: Date;  // ✅ Add this optional field
}

export type ExportFormat = 'txt' | 'csv' | 'json' | 'srt' | 'youtube';

export interface AudioFile {
  name: string;
  url: string;
  duration: number;
}
