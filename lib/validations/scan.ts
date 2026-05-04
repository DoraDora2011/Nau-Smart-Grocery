import { z } from "zod";

export const scanMetadataSchema = z.object({
  source: z.enum(["camera", "upload"])
});
