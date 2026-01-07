# Backend Integration Instructions

## ✅ Current Status
Your backend repo already has anime-backend code integrated!
- Routes are active in `index.js` (line 10, 457)
- Already deployed at: https://timestamper-backend-o44d.onrender.com

## 📝 What You Need To Do

### 1. Extract Google Drive Folder IDs

**Music Folder:**
- Link: https://drive.google.com/drive/folders/1eLmAlIZdOdpvONr-TwdoOLpO_fpvRR8-
- **Folder ID:** `1eLmAlIZdOdpvONr-TwdoOLpO_fpvRR8-`

**Videos Folder:**
- Link: https://drive.google.com/drive/folders/1rTaC2nSuVBIFkARScLB6yKhFho5O0hgZ
- **Folder ID:** `1rTaC2nSuVBIFkARScLB6yKhFho5O0hgZ`

### 2. Add Environment Variables on Render

Go to your Render dashboard and add these env vars:

```bash
# Google Drive Configuration
GOOGLE_DRIVE_API_KEY=your_api_key_here
GOOGLE_DRIVE_FOLDER_ID=1rTaC2nSuVBIFkARScLB6yKhFho5O0hgZ
GOOGLE_DRIVE_MUSIC_FOLDER_ID=1eLmAlIZdOdpvONr-TwdoOLpO_fpvRR8-

# Enable Direct Streaming (recommended for large files)
STREAM_DIRECT_SOURCES=true

# Frontend URL (already set, but verify)
FRONTEND_URL=https://www.timestamper.site
```

### 3. Get Google Drive API Key

**Option A: Using Google Cloud Console (Recommended)**
1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable "Google Drive API"
   - Go to "APIs & Services" → "Library"
   - Search "Google Drive API" → Enable
4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the key
   - Restrict it (Optional but recommended):
     - Application restrictions: HTTP referrers
     - Add: `https://timestamper-backend-o44d.onrender.com/*`
     - API restrictions: Restrict key → Select "Google Drive API"

**Option B: Quick Test (No restrictions)**
1. Same steps as above
2. Don't restrict the key initially
3. Test if it works first
4. Add restrictions later

### 4. Verify FFmpeg on Render

Check if FFmpeg is installed on your Render service:
- Go to Render Dashboard → Your Service → "Shell"
- Run: `ffmpeg -version`

**If not installed**, update your build command:
```bash
apt-get update && apt-get install -y ffmpeg && npm install
```

### 5. Organize Google Drive Folders

Your Drive structure should look like:

```
Videos Folder (1rTaC2nSuVBIFkARScLB6yKhFho5O0hgZ)/
├── Naruto/
│   ├── clip1.mp4
│   ├── clip2.mp4
│   └── ...
├── Demon Slayer/
│   ├── scene1.mp4
│   └── ...
└── Bleach/
    └── ...

Music Folder (1eLmAlIZdOdpvONr-TwdoOLpO_fpvRR8-)/
├── track1.mp3
├── track2.wav
└── ...
```

### 6. Test the Integration

After setting env vars and deploying:

**Test Music API:**
```bash
curl https://timestamper-backend-o44d.onrender.com/api/music-list
```

Expected response:
```json
{
  "success": true,
  "music": [
    {
      "id": "file_id",
      "name": "track1.mp3",
      "displayName": "track1",
      "path": "/api/proxy?url=...",
      "url": "https://drive.google.com/...",
      "source": "drive"
    }
  ]
}
```

**Test Videos API:**
```bash
curl https://timestamper-backend-o44d.onrender.com/api/videos
```

Expected response:
```json
{
  "animes": [
    {
      "id": "Naruto",
      "name": "Naruto",
      "videoCount": 5
    }
  ]
}
```

## 🔧 Troubleshooting

### Issue: "No music files found"
- Check GOOGLE_DRIVE_MUSIC_FOLDER_ID is correct
- Verify API key has "Google Drive API" enabled
- Ensure folder is shared: "Anyone with the link can view"

### Issue: "No videos found"
- Check GOOGLE_DRIVE_FOLDER_ID is correct
- Create subfolders in the videos folder (one per anime)
- Each subfolder should contain .mp4 files

### Issue: "Failed to connect to backend"
- Verify Render service is running
- Check Render logs for errors
- Ensure CORS_ORIGIN includes your frontend domain

### Issue: FFmpeg errors
- Add FFmpeg to build command (see step 4)
- Redeploy the service

## 🚀 After Configuration

1. **Redeploy on Render** after adding env vars
2. **Test the endpoints** using curl commands above
3. **Visit your frontend**: https://www.timestamper.site/anime-editor
4. **Check browser console** for any errors

## 📊 Expected Flow

1. User opens Anime Editor
2. Frontend fetches `/api/music-list` → Gets music from Google Drive
3. Frontend fetches `/api/videos` → Gets anime catalog
4. User selects music + anime + settings
5. Frontend POSTs to `/api/create-video`
6. Backend:
   - Fetches music from Drive
   - Fetches video clips from Drive
   - Analyzes audio (BPM, energy)
   - Processes clips with FFmpeg
   - Saves to `outputs/`
7. Frontend polls `/api/status/:filename`
8. When ready, user downloads via `/api/download/:filename`

## ✅ Checklist

- [ ] Get Google Drive API Key
- [ ] Add all environment variables to Render
- [ ] Verify FFmpeg is installed
- [ ] Organize Drive folders properly
- [ ] Test music-list endpoint
- [ ] Test videos endpoint
- [ ] Deploy and test frontend integration

## 🆘 Need Help?

If you get stuck:
1. Check Render deployment logs
2. Look at browser console (F12)
3. Share the error messages
4. Verify all env vars are set correctly
