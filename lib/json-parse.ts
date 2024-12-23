import { z } from "zod";

/**
 * The top-level schema that ensures:
 * - It is an object with at least { EULA: string }
 * - All other properties are valid JSON (validated by the above `jsonSchema`).
 */
export const minecraftEnvVarsSchema = z.preprocess(
  (val: unknown) => {
    const jsonValue = z.string().parse(val);
    return JSON.parse(jsonValue);
  },
  z
    .object({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      EULA: z.string(), // Must have an EULA string property at the top level
    })
    .catchall(z.string()),
);

export type MinecraftImageEnv = z.infer<typeof minecraftEnvVarsSchema>;
