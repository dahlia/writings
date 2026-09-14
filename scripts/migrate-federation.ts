import { getStore } from "@netlify/blobs";
import postgres from "postgres";
import { parseArgs } from "node:util";
import { createMigrationFetch } from "./migration-fetch.ts";
import { blobsStoreName } from "../src/lib/federation/storage.ts";
import {
  migrateFederation,
  MigrationError,
  type SourceEntry,
} from "./federation-migration.ts";

async function main(): Promise<void> {
  // Require a clean operator environment rather than running inside Netlify Dev.
  // Explicit credentials already isolate getStore() from ambient SDK context.
  if (
    process.env.NETLIFY_BLOBS_CONTEXT ||
    "netlifyBlobsContext" in globalThis
  ) {
    throw new MigrationError(
      "Run migration outside Netlify Dev and without NETLIFY_BLOBS_CONTEXT.",
    );
  }
  const { values } = parseArgs({
    options: {
      apply: { type: "boolean", default: false },
      quiesced: { type: "boolean", default: false },
      concurrency: { type: "string", default: "4" },
    },
  });
  const concurrency = Number(values.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new MigrationError("Concurrency must be an integer from 1 to 16.");
  }
  if (values.apply && !values.quiesced)
    throw new MigrationError("Apply requires --quiesced.");
  const connection = process.env.MIGRATION_DATABASE_URL;
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!connection || !siteID || !token)
    throw new Error("Migration credentials are required.");
  const sql = postgres(connection, { max: 1, onnotice: () => {} });
  try {
    const source = await sql.begin(
      "isolation level repeatable read read only",
      async (transaction) => {
        const rows = await transaction<
          { key: string[]; value: unknown; expires_at: string | null }[]
        >`
        SELECT key, value,
          CASE WHEN ttl IS NULL THEN NULL
            ELSE (EXTRACT(EPOCH FROM (created + ttl)) * 1000)::text
          END AS expires_at
        FROM fedify_kv_v2
      `;
        return rows.map((row): SourceEntry => ({
          key: row.key,
          value: row.value,
          expiresAt: row.expires_at == null ? null : Number(row.expires_at),
        }));
      },
    );
    const store = getStore({
      name: blobsStoreName,
      siteID,
      token,
      consistency: "strong",
      fetch: createMigrationFetch(),
    });
    const result = await migrateFederation(source, store, {
      origin: "https://writings.hongminhee.org",
      apply: values.apply,
      quiesced: values.quiesced,
      concurrency,
    });
    console.log(
      JSON.stringify({
        mode: values.apply ? "apply" : "dry-run",
        ...result,
      }),
    );
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  // Driver/HTTP errors can contain credentials, SQL values, or actor private keys.
  if (error instanceof MigrationError) console.error(error.message);
  console.error(
    "Migration failed. Keep maintenance active; check credentials, source readiness, key limits, queue drain and destination conflicts. No readiness guarantee was made.",
  );
  process.exitCode = 1;
});
