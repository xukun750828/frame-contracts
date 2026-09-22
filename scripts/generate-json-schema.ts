import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { SceneGroundTruthSchema } from "../src/index.js";

const outputDir = resolve("schemas");
mkdirSync(outputDir, { recursive: true });
const schema = z.toJSONSchema(SceneGroundTruthSchema, {
  target: "draft-2020-12",
  unrepresentable: "any",
});
writeFileSync(
  resolve(outputDir, "scene-ground-truth-v0.1.schema.json"),
  JSON.stringify({
    $id: "https://frame.dev/schemas/scene-ground-truth-v0.1.schema.json",
    title: "FRAME Scene Ground Truth v0.1",
    ...schema,
  }, null, 2) + "\n",
  "utf8",
);
