/**
 * Fetch real-time Twitter/X profile avatar image directly
 */
const avatarCache = {};

export async function fetchTwitterAvatar(username) {
  if (!username || username.length < 2) return null;
  const clean = username.replace('@', '').trim().toLowerCase();

  if (avatarCache[clean]) {
    return avatarCache[clean];
  }

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
    console.warn('Avatar fetch notice:', e);
  }

  // Fallback to unavatar CDN
  const unavatarUrl = `https://unavatar.io/x/${clean}`;
  avatarCache[clean] = unavatarUrl;
  return unavatarUrl;
}
