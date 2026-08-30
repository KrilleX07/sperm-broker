/**
 * Robust real-time Twitter/X profile avatar resolver
 */
const avatarCache = {};

export async function fetchTwitterAvatar(username) {
  if (!username || username.length < 2) return null;
  const clean = username.replace('@', '').trim().toLowerCase();

  if (avatarCache[clean]) {
    return avatarCache[clean];
  }

  // 1. Try our dedicated Vercel Serverless Function /api/avatar
  try {
    const res = await fetch(`/api/avatar?username=${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.avatarUrl && (data.avatarUrl.includes('twimg.com') || data.avatarUrl.startsWith('http'))) {
        avatarCache[clean] = data.avatarUrl;
        return data.avatarUrl;
      }
    }
  } catch (e) {
    console.warn('Local API avatar fetch notice:', e);
  }

  // 2. Try Microlink direct public API
  try {
    const res = await fetch(`https://api.microlink.io/?url=https://x.com/${clean}`);
    if (res.ok) {
      const json = await res.json();
      const imgUrl = json?.data?.image?.url;
      if (imgUrl && imgUrl.includes('twimg.com')) {
        avatarCache[clean] = imgUrl;
        return imgUrl;
      }
    }
  } catch (e) {
    console.warn('Microlink avatar fetch notice:', e);
  }

  return null;
}
