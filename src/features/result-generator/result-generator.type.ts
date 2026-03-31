import type { z } from "zod";
import type { generateResultSchema } from "./result-generator.schema";

export type GenerateResult = z.infer<typeof generateResultSchema>;
export type GenerateResultInput = z.input<typeof generateResultSchema>;

export type ResultRecord = Record<string, string | number>;
