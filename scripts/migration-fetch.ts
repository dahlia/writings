// Pace all SDK HTTP requests, including signed-URL requests and SDK retries.
// The pinned Blobs SDK owns bounded retry attempts; this wrapper adds a shared
// Retry-After cooldown, so concurrent workers do not each retry at full speed.
export function createMigrationFetch(
  fetcher: typeof fetch = globalThis.fetch,
): typeof fetch {
  let nextStart = 0;
  let cooldown = 0;
  let queue = Promise.resolve();
  return async (input, init) => {
    const turn = queue.then(async () => {
      let remaining: number;
      while ((remaining = Math.max(nextStart, cooldown) - Date.now()) > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(remaining, 60_000)),
        );
      }
      nextStart = Date.now() + 250;
    });
    queue = turn.catch(() => {});
    await turn;
    const response = await fetcher(input, init);
    if (response.status === 429) {
      const now = Date.now();
      const retry = response.headers.get("Retry-After");
      const retryAt =
        retry == null
          ? NaN
          : /^\d+(?:\.\d+)?$/.test(retry)
            ? now + Number(retry) * 1000
            : Date.parse(retry);
      const reset = response.headers.get("X-RateLimit-Reset");
      const resetAt = reset == null ? NaN : Number(reset) * 1000;
      cooldown = Math.max(
        cooldown,
        now + 5_000,
        Number.isFinite(retryAt) ? retryAt : 0,
        Number.isFinite(resetAt) ? resetAt : 0,
      );
    }
    return response;
  };
}
