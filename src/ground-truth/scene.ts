import { z } from "zod";

export const FRAME_GROUND_TRUTH_SCHEMA_VERSION = "0.1" as const;

export const SceneGroundTruthBoundaryConfidenceSchema = z.enum([
  "certain",
  "uncertain",
]);

export const SceneGroundTruthBoundarySchema = z.object({
  id: z.string().min(1),
  timestampMs: z.number().int().positive(),
  confidence: SceneGroundTruthBoundaryConfidenceSchema,
  notes: z.string().optional(),
}).strict();

export const SceneGroundTruthSchema = z.object({
  schemaVersion: z.literal(FRAME_GROUND_TRUTH_SCHEMA_VERSION),
  videoId: z.string().min(1),
  durationMs: z.number().int().positive(),
  annotationVersion: z.string().min(1),
  annotatorId: z.string().min(1).optional(),
  boundaries: z.array(SceneGroundTruthBoundarySchema),
}).strict().superRefine((value, ctx) => {
  const ids = new Set<string>();
  const timestamps = new Set<number>();
  let previous = -1;

  for (let index = 0; index < value.boundaries.length; index += 1) {
    const item = value.boundaries[index];

    if (item.timestampMs >= value.durationMs) {
      ctx.addIssue({
        code: "custom",
        path: ["boundaries", index, "timestampMs"],
        message: "ground truth boundary must stay inside video duration",
      });
    }
    if (ids.has(item.id)) {
      ctx.addIssue({
        code: "custom",
        path: ["boundaries", index, "id"],
        message: "ground truth boundary id must be unique",
      });
    }
    if (timestamps.has(item.timestampMs)) {
      ctx.addIssue({
        code: "custom",
        path: ["boundaries", index, "timestampMs"],
        message: "ground truth boundary timestamp must be unique",
      });
    }
    if (item.timestampMs <= previous) {
      ctx.addIssue({
        code: "custom",
        path: ["boundaries", index, "timestampMs"],
        message: "ground truth boundaries must be sorted by timestamp",
      });
    }

    ids.add(item.id);
    timestamps.add(item.timestampMs);
    previous = item.timestampMs;
  }
});

export type SceneGroundTruthBoundaryConfidence = z.infer<
  typeof SceneGroundTruthBoundaryConfidenceSchema
>;
export type SceneGroundTruthBoundary = z.infer<
  typeof SceneGroundTruthBoundarySchema
>;
export type SceneGroundTruth = z.infer<typeof SceneGroundTruthSchema>;
