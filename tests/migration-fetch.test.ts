import { afterEach, expect, test, vi } from "vitest";
import { createMigrationFetch } from "../scripts/migration-fetch";

afterEach(() => vi.useRealTimers());

test("paces concurrent requests at four starts per second", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const times: number[] = [];
  const fetcher = createMigrationFetch(async () => {
    times.push(Date.now());
    return new Response();
  });
  const done = Promise.all(
    Array.from({ length: 4 }, () => fetcher("https://example.com")),
  );
  await vi.runAllTimersAsync();
  await done;
  expect(times).toEqual([0, 250, 500, 750]);
});

test.each([
  [{ "Retry-After": "10" }, 10_000],
  [
    {
      "Retry-After": new Date(10_000).toUTCString(),
      "X-RateLimit-Reset": "20",
    },
    20_000,
  ],
  [{ "Retry-After": "invalid" }, 5_000],
] as const)("shares 429 cooldown across workers", async (headers, delay) => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const times: number[] = [];
  const fetcher = createMigrationFetch(async () => {
    times.push(Date.now());
    return times.length === 1
      ? new Response(null, { status: 429, headers })
      : new Response();
  });
  const done = Promise.all(
    Array.from({ length: 3 }, () => fetcher("https://example.com")),
  );
  await vi.runAllTimersAsync();
  expect((await done)[0]!.status).toBe(429);
  expect(times).toEqual([0, delay, delay + 250]);
});

test("leaves bounded retries to the SDK and does not poison the scheduling queue", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const request = vi
    .fn<typeof fetch>()
    .mockRejectedValueOnce(new Error("network"))
    .mockResolvedValue(new Response());
  const fetcher = createMigrationFetch(request);
  const first = fetcher("https://example.com").catch((error: unknown) => error);
  await vi.runAllTimersAsync();
  expect(await first).toMatchObject({ message: "network" });
  const second = fetcher("https://example.com");
  await vi.runAllTimersAsync();
  expect((await second).status).toBe(200);
  expect(request).toHaveBeenCalledTimes(2);
});
