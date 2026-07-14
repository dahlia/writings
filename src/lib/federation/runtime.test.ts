import { describe, expect, test } from "vitest";
import { selectFederationServices } from "./config";

describe("selectFederationServices", () => {
  test("uses persistent services in production when a database is available", () => {
    expect(selectFederationServices("production", true)).toBe("netlify");
  });

  test("disables federation in production without a database", () => {
    expect(selectFederationServices("production", false)).toBe("disabled");
  });

  test("disables federation for non-production deploys", () => {
    expect(selectFederationServices("deploy-preview", true)).toBe("disabled");
    expect(selectFederationServices("branch-deploy", true)).toBe("disabled");
    expect(selectFederationServices("preview-server", true)).toBe("disabled");
  });

  test("uses persistent services in Netlify Dev when a database is available", () => {
    expect(selectFederationServices("dev", true)).toBe("netlify");
  });

  test("uses in-process services in plain Astro dev", () => {
    expect(selectFederationServices(undefined, true)).toBe("memory");
  });

  test("uses in-process services when no database is available", () => {
    expect(selectFederationServices("dev", false)).toBe("memory");
    expect(selectFederationServices(undefined, false)).toBe("memory");
  });
});
