// Shared Snapchat public-profile fetcher/parser.
// Files prefixed with "_" are NOT exposed as Vercel routes — this is a helper
// imported by both the serverless function (api/profile.js) and the Vite dev
// middleware (vite.config.ts).
//
// It only reads PUBLIC data that Snapchat already serves to anyone visiting
// https://www.snapchat.com/@<username> (the same Open Graph / page data a
// browser receives). No authentication, no private data.

const SNAP_BASE = 'https://www.snapchat.com/@';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export function cleanUsername(raw) {
  return String(raw || '').trim().replace(/^@+/, '').toLowerCase();
}

export function isValidUsername(u) {
  // Snapchat usernames: start with a letter/number, 3–15 chars, [a-z0-9._-]
  return /^[a-z0-9][a-z0-9._-]{2,14}$/.test(u);
}

function nonEmpty(v) {
  const s = v == null ? '' : String(v).trim();
  return s.length ? s : null;
}

function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * @returns {Promise<{found:boolean, reason?:string, ...profile}>}
 */
export async function fetchSnapProfile(rawUsername) {
  const username = cleanUsername(rawUsername);
  if (!isValidUsername(username)) {
    return { found: false, reason: 'invalid', username };
  }

  let res;
  try {
    res = await fetch(SNAP_BASE + encodeURIComponent(username), {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
  } catch (e) {
    return { found: false, reason: 'network_error', username, message: String(e && e.message || e) };
  }

  if (res.status === 404) return { found: false, reason: 'not_found', username };
  if (!res.ok) return { found: false, reason: 'upstream_error', status: res.status, username };

  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return { found: false, reason: 'no_data', username };

  let data;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return { found: false, reason: 'parse_error', username };
  }

  const pp = (data && data.props && data.props.pageProps) || {};
  const up = pp.userProfile;
  if (!up) return { found: false, reason: 'not_found', username };

  // Public share image rendered by Snapchat (works for any profile type).
  const link = pp.linkPreview || {};
  const shareImage =
    (link.twitterImage && link.twitterImage.url) ||
    (link.facebookImage && link.facebookImage.url) ||
    null;

  const out = {
    found: true,
    username,
    displayName: username,
    avatarUrl: shareImage,
    snapcodeUrl: null,
    bio: null,
    subscriberCount: null,
    website: null,
    verified: false,
    isPublicProfile: false,
  };

  if (up.$case === 'publicProfileInfo' && up.publicProfileInfo) {
    const p = up.publicProfileInfo;
    out.isPublicProfile = true;
    out.displayName = nonEmpty(p.title) || username;
    out.avatarUrl = nonEmpty(p.profilePictureUrl) || nonEmpty(p.squareHeroImageUrl) || shareImage;
    out.snapcodeUrl = nonEmpty(p.snapcodeImageUrl);
    out.bio = nonEmpty(p.bio);
    out.subscriberCount = toInt(p.subscriberCount);
    out.website = nonEmpty(p.websiteUrl);
    out.verified = p.badge === 1 || p.badge === true;
  } else if (up.$case === 'userInfo' && up.userInfo) {
    const p = up.userInfo;
    out.displayName = nonEmpty(p.displayName) || username;
    out.snapcodeUrl = nonEmpty(p.snapcodeImageUrl);
    const bitmoji =
      (p.bitmoji3d && (p.bitmoji3d.avatarImage && p.bitmoji3d.avatarImage.url)) || null;
    out.avatarUrl = nonEmpty(bitmoji) || shareImage;
  }

  return out;
}
