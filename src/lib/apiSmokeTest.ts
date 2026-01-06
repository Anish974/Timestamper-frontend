export async function runApiSmokeTest(baseUrl: string) {
  const results: Record<string, any> = {}

  const tryFetch = async (name: string, url: string) => {
    try {
      const res = await fetch(url, { method: 'GET' })
      const type = res.headers.get('content-type') || ''
      let body: any = null
      if (type.includes('application/json')) body = await res.json()
      else body = await res.text()
      results[name] = { ok: res.ok, status: res.status, type, body }
    } catch (err: any) {
      results[name] = { ok: false, error: err?.message || String(err) }
    }
  }

  await tryFetch('health', `${baseUrl}/api/health`)
  await tryFetch('videos', `${baseUrl}/api/videos`)
  await tryFetch('music', `${baseUrl}/api/music-list`)

  // Drive sample check (optional): if music list returns full URLs
  const music = results['music']?.body
  if (music?.success && Array.isArray(music.music) && music.music.length) {
    const sample = music.music[0]
    const path: string = sample?.path || ''
    results['driveSample'] = {
      isFullUrl: path.startsWith('http://') || path.startsWith('https://'),
      path,
    }
  }

  return results
}
