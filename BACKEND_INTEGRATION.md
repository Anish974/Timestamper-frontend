# Backend-Frontend Integration Checklist

## ✅ Completed

### Backend Setup
- [x] Backend code added to `anime-backend/` folder
- [x] Added to `.gitignore` (not committed to repo)
- [x] Using Google Drive for video sources
- [x] Using Google Drive for music files
- [x] Supabase storage support available
- [x] Direct streaming enabled (`STREAM_DIRECT_SOURCES=true`)

### API Routes
- [x] `GET /api/music-list` - Returns music from Drive/Supabase/local
- [x] `GET /api/videos` - Returns anime catalog
- [x] `POST /api/create-video` - Processes video
- [x] `GET /api/status/:filename` - Check processing status
- [x] `GET /api/download/:filename` - Download completed video

### Frontend Integration
- [x] API URL configuration via `VITE_API_BASE_URL`
- [x] Fallback to `VITE_API_URL` for backward compatibility
- [x] Environment detection (dev vs production)
- [x] Google Drive URL handling (no double-prefix)
- [x] Error handling with detailed logging
- [x] Health check support in AnimeEditor

## 📋 Integration Requirements

### Environment Variables Needed on Render

```bash
# Google Drive (required for video/music streaming)
GOOGLE_DRIVE_API_KEY=your_api_key_here
GOOGLE_DRIVE_FOLDER_ID=parent_folder_id_for_videos
GOOGLE_DRIVE_MUSIC_FOLDER_ID=folder_id_for_music

# Enable direct streaming (recommended)
STREAM_DIRECT_SOURCES=true

# Optional: Supabase Storage (alternative to Drive)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET_VIDEOS=anime-videos
SUPABASE_STORAGE_BUCKET_MUSIC=music-tracks

# CORS (allow frontend domain)
CORS_ORIGIN=https://www.timestamper.site,https://timestamper.site
```

### Required Dependencies (Backend)
```json
{
  "dependencies": {
    "fluent-ffmpeg": "^2.1.2",
    "uuid": "^9.0.0"
  }
}
```

### FFmpeg Requirement
- Backend server needs FFmpeg installed
- Render: Add build command `apt-get update && apt-get install -y ffmpeg`

## 🔧 Known Issues & Fixes

### 1. CORS Errors
**Issue**: Frontend can't fetch from backend
**Fix**: Backend must set CORS headers:
```javascript
app.use(cors({
  origin: ['https://www.timestamper.site', 'https://timestamper.site', 'http://localhost:8080'],
  credentials: true
}))
```

### 2. Google Drive URL Construction
**Issue**: Double prefix (backend + drive URL)
**Fix**: Already handled in `AnimeEditor.tsx` line 96-100:
```typescript
const isFullUrl = track.path?.startsWith('http://') || track.path?.startsWith('https://')
const trackUrl = isFullUrl ? track.path : `${API_BASE_URL}${track.path}`
```

### 3. Streaming vs Download
**Issue**: Large videos timeout when downloading
**Fix**: Set `STREAM_DIRECT_SOURCES=true` in backend env
- Backend converts Drive URLs to `alt=media` format
- FFmpeg reads directly from stream
- No temp file downloads needed

### 4. Music List Fallback
**Backend priority**:
1. Supabase Storage (if configured)
2. Google Drive (if API key set)
3. Local `./music/` folder (fallback)

**Frontend handling**: Accepts any source, checks for full URLs

## 🚀 Deployment Steps

### Backend (Render)
1. Add backend code to your Render service
2. Set all environment variables (see above)
3. Add FFmpeg to build:
   ```bash
   apt-get update && apt-get install -y ffmpeg
   ```
4. Deploy

### Frontend (Vercel)
1. Already configured with `VITE_API_BASE_URL` support
2. Set in Vercel Dashboard:
   - `VITE_API_BASE_URL=https://timestamper-backend-o44d.onrender.com`
3. Redeploy

## 🧪 Testing

### Manual Tests
1. **Health Check**:
   ```bash
   curl https://timestamper-backend-o44d.onrender.com/api/health
   ```

2. **Music List**:
   ```bash
   curl https://timestamper-backend-o44d.onrender.com/api/music-list
   ```

3. **Video Catalog**:
   ```bash
   curl https://timestamper-backend-o44d.onrender.com/api/videos
   ```

### Frontend Tests
- Use `src/lib/apiSmokeTest.ts` utility
- Check browser console for detailed logs
- Look for `🔍 Loading data from:` message

## 📝 Next Steps

### What You Need to Provide:
1. ✅ Google Drive API Key
2. ✅ Folder IDs for videos and music
3. ✅ Share permissions set to "Anyone with link"

### Backend Integration:
You mentioned backend is already on Render. I need to know:
- [ ] Is `anime-backend/` code already integrated in your Render service?
- [ ] Are the routes (`/api/music-list`, `/api/videos`, etc.) already live?
- [ ] Is FFmpeg installed on Render?
- [ ] Are Google Drive env vars set?

### If Not Integrated Yet:
I can help you:
1. Copy these files to your main backend repo
2. Update your `index.js` or `server.js` to include these routes
3. Set up the environment variables
4. Test the endpoints

## 🎯 Current Status

**Frontend**: ✅ Ready and deployed
- All API calls use `VITE_API_BASE_URL`
- Handles both relative and absolute URLs
- Detailed error logging
- Google Drive streaming support

**Backend**: ⚠️ Needs Verification
- Code is available in `anime-backend/`
- Not yet confirmed if routes are live on Render
- Environment variables may need configuration

**Integration**: 🔄 Pending
- Need to verify backend routes are accessible
- Test music list and video catalog endpoints
- Confirm video processing pipeline works
