/* eslint-disable @typescript-eslint/naming-convention */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import {
  minecraftEnvVarsSchema,
  booleanStringSchema,
  stringIsNumberSchema,
  stringToNumberSchema,
} from "./lib/types";

const DEFAULT_TASK_MEMORY = "2048";
const DEFAULT_TASK_CPU = "1024";
export const env = createEnv({
  server: {
    // Required
    DOMAIN_NAME: z.string().nonempty("DOMAIN_NAME is required"),
    CDK_DEFAULT_ACCOUNT: z.string().nonempty("CDK_DEFAULT_ACCOUNT is required"),
    CDK_DEFAULT_REGION: z.string().nonempty("CDK_DEFAULT_REGION is required"),

    // Optional (with transformations)
    SUBDOMAIN_PART: z.string().optional(),
    SERVER_REGION: z.string().optional(),
    MINECRAFT_EDITION: z.enum(["java", "bedrock"]).optional(),

    STARTUP_MINUTES: stringIsNumberSchema.optional(),
    SHUTDOWN_MINUTES: stringIsNumberSchema.optional(),
    USE_FARGATE_SPOT: booleanStringSchema.optional(),
    TASK_MEMORY: stringToNumberSchema.optional().default(DEFAULT_TASK_MEMORY),
    TASK_CPU: stringToNumberSchema.optional().default(DEFAULT_TASK_CPU),
    VPC_ID: z.string().optional(),
    MINECRAFT_IMAGE_ENV_VARS_JSON: minecraftEnvVarsSchema,
    SNS_EMAIL_ADDRESS: z.string().optional(),
    TWILIO_PHONE_FROM: z.string().optional(),
    TWILIO_PHONE_TO: z.string().optional(),
    TWILIO_ACCOUNT_ID: z.string().optional(),
    TWILIO_AUTH_CODE: z.string().optional(),

    DEBUG: booleanStringSchema.optional(),

    // If you need CDK_NEW_BOOTSTRAP as an integer:
    CDK_NEW_BOOTSTRAP: stringToNumberSchema.optional(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "PUBLIC_",

  client: {},

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * As recommended, treat empty strings as undefined for validation.
   */
  emptyStringAsUndefined: true,
});
