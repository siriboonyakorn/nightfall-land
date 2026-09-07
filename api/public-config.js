module.exports = function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const url = (process.env.SUPABASE_URL || '').trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || '').trim();
  if (!url || !anonKey) {
    return response.status(503).json({ error: 'Public Supabase configuration is missing.' });
  }

  return response.status(200).json({ url, anonKey });
};
