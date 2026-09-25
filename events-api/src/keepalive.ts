const SELF_URL = process.env.SELF_URL;
const INTERVAL_MS = 13 * 60 * 1000;

export function startKeepAlive() {
  if (process.env.NODE_ENV !== 'production' || !SELF_URL) return;
  setInterval(() => {
    fetch(SELF_URL)
      .then((r) => console.log(`[keepalive] ${r.status}`))
      .catch((e) => console.warn('[keepalive] failed', e?.message));
  }, INTERVAL_MS);
}
