const ALLOWED_METHODS = new Set(['GET', 'POST', 'PATCH']);

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body));
}

function getBearerToken(request) {
  const authorization = request.headers.authorization || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url, serviceRoleKey };
}

async function supabaseRequest(url, serviceRoleKey, path, options = {}) {
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch (error) {
    body = null;
  }

  return { response, body };
}

module.exports = async function handler(request, response) {
  if (!ALLOWED_METHODS.has(request.method)) {
    response.setHeader('Allow', [...ALLOWED_METHODS]);
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  const { url, serviceRoleKey } = getSupabaseConfig();
  if (!url || !serviceRoleKey) {
    return sendJson(response, 500, { error: 'Server database configuration is missing.' });
  }

  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return sendJson(response, 401, { error: 'Authentication required.' });
  }

  const userResult = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!userResult.ok) {
    return sendJson(response, 401, { error: 'Invalid or expired session.' });
  }

  const user = await userResult.json();
  if (!user.id) {
    return sendJson(response, 401, { error: 'Invalid authenticated user.' });
  }

  const profilePath = `/rest/v1/player_profiles?id=eq.${encodeURIComponent(user.id)}`;

  try {
    if (request.method === 'GET') {
      const result = await supabaseRequest(url, serviceRoleKey, `${profilePath}&select=*`);
      if (!result.response.ok) return sendJson(response, 502, { error: 'Profile lookup failed.' });
      return sendJson(response, 200, result.body && result.body[0] ? result.body[0] : null);
    }

    const payload = request.body && typeof request.body === 'object' ? request.body : {};
    const profile = {
      id: user.id,
      username: typeof payload.username === 'string' ? payload.username.trim() : undefined,
      avatar: typeof payload.avatar === 'string' ? payload.avatar : undefined,
      current_region: typeof payload.current_region === 'string' ? payload.current_region : undefined,
      current_level: Number.isInteger(payload.current_level) ? payload.current_level : undefined,
      unlocked_levels: Array.isArray(payload.unlocked_levels) ? payload.unlocked_levels : undefined,
      moon_shards: Number.isInteger(payload.moon_shards) ? payload.moon_shards : undefined,
      score: Number.isInteger(payload.score) ? payload.score : undefined
    };
    Object.keys(profile).forEach(key => profile[key] === undefined && delete profile[key]);

    if (request.method === 'POST') {
      const result = await supabaseRequest(url, serviceRoleKey, '/rest/v1/player_profiles?on_conflict=id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(profile)
      });
      if (!result.response.ok) return sendJson(response, 502, { error: 'Profile creation failed.' });
      return sendJson(response, 200, result.body && result.body[0] ? result.body[0] : null);
    }

    delete profile.username;
    delete profile.avatar;
    delete profile.id;
    const result = await supabaseRequest(url, serviceRoleKey, profilePath, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(profile)
    });
    if (!result.response.ok) return sendJson(response, 502, { error: 'Profile update failed.' });
    return sendJson(response, 200, result.body && result.body[0] ? result.body[0] : null);
  } catch (error) {
    return sendJson(response, 502, { error: 'Database request failed.' });
  }
};
