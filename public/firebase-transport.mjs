import {deadline} from './session.mjs';
// REST reads are server-only: unlike SDK get(), they cannot fall back to cache.
// Conditional PUT uses the documented RTDB ETag transaction mechanism.
export function createRestTransport({databaseURL, user, appCheckToken, fetchImpl = globalThis.fetch}) {
  const base = new URL(databaseURL);
  if (base.protocol !== 'https:' || !/\.(firebaseio\.com|firebasedatabase\.app)$/.test(base.hostname)) throw Error('Invalid Firebase database URL');
  const path = '/demoSessions/' + encodeURIComponent(user.uid) + '/verified_v2.json';
  async function request(method, value, extraHeaders = {}) {
    const token = await deadline(user.getIdToken());
    const check = await deadline(appCheckToken());
    const url = new URL(path, base); url.searchParams.set('auth', token);
    const headers = {...extraHeaders, 'X-Firebase-AppCheck': check};
    if (value !== undefined) headers['Content-Type'] = 'application/json';
    let response;
    try {
      response = await fetchImpl(url.href, {method, headers, cache: 'no-store', referrerPolicy: 'no-referrer',
        signal: AbortSignal.timeout(15000), ...(value === undefined ? {} : {body: JSON.stringify(value)})});
    } catch { throw Error('Firebase network request failed or timed out; server outcome unconfirmed'); }
    if (!response.ok) throw Error(response.status === 412 ? 'Session changed in another tab; reload' : 'Firebase HTTP ' + response.status + '; check Auth, App Check and database rules');
    return response;
  }
  return {
    async read() { return (await request('GET')).json(); },
    async write(envelope, expectedRevision) {
      const prior = await request('GET', undefined, {'X-Firebase-ETag': 'true'});
      const etag = prior.headers.get('etag'), data = await prior.json();
      if ((data?.revision ?? 0) !== expectedRevision) throw Error('Session revision conflict; reload');
      if (!etag) throw Error('Firebase ETag missing; refusing an unconditional overwrite');
      await request('PUT', envelope, {'if-match': etag});
    }
  };
}
