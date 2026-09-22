import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  FRAME_GROUND_TRUTH_SCHEMA_VERSION,
  SceneGroundTruthSchema,
} from "../src/index.js";

function fixture(name: string): unknown {
  return JSON.parse(readFileSync(resolve("fixtures", "scene", name), "utf8"));
}

test("FC-001 accepts minimal Scene GT", () => {
  const parsed = SceneGroundTruthSchema.parse(fixture("valid-minimal-v0.1.json"));
  assert.equal(parsed.schemaVersion, FRAME_GROUND_TRUTH_SCHEMA_VERSION);
  assert.equal(parsed.boundaries.length, 0);
});

test("FC-002 accepts full Scene GT", () => {
  const parsed = SceneGroundTruthSchema.parse(fixture("valid-full-v0.1.json"));
  assert.equal(parsed.boundaries.length, 2);
  assert.equal(parsed.boundaries[1].confidence, "uncertain");
});

for (const name of [
  "invalid-duplicate-timestamp.json",
  "invalid-out-of-range.json",
  "invalid-unsorted.json",
]) {
  test(`FC-003 rejects invalid fixture: ${name}`, () => {
    assert.equal(SceneGroundTruthSchema.safeParse(fixture(name)).success, false);
  });
}
