// Vercel Serverless Function: GET /api/profile?username=<name>
// Returns the public Snapchat profile data as JSON. Runs server-side so it is
// not blocked by CORS the way a direct browser fetch to snapchat.com would be.

import { fetchSnapProfile } from './_snap.js';

export default async function handler(req, res) {
  const username =
    (req.query && req.query.username) ||
    new URL(req.url, 'http://localhost').searchParams.get('username') ||
    '';

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Cache positive/negative lookups briefly at the edge.
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (!username) {
    res.statusCode = 400;
    res.end(JSON.stringify({ found: false, reason: 'missing_username' }));
    return;
  }

  try {
    const profile = await fetchSnapProfile(username);
    res.statusCode = 200;
    res.end(JSON.stringify(profile));
  } catch (e) {
    res.statusCode = 200;
    res.end(JSON.stringify({ found: false, reason: 'error', message: String((e && e.message) || e) }));
  }
}
