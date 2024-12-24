/* eslint-disable @typescript-eslint/naming-convention */
import {
  type StackConfig,
  minecraftJavaImageConfigSchema,
  type MinecraftJavaImageConfig,
} from "./types";
import { env } from "../env";

const minecraftImageConfig: MinecraftJavaImageConfig = {
  EULA: "TRUE",
  ONLINE_MODE: "FALSE",
};

export const resolveConfig = (): StackConfig => ({
  domainName: env.DOMAIN_NAME || "",
  subdomainPart: env.SUBDOMAIN_PART ?? "minecraft",
  serverRegion: env.SERVER_REGION ?? "us-east-1",
  minecraftEdition: env.MINECRAFT_EDITION === "bedrock" ? "bedrock" : "java",
  shutdownMinutes: env.SHUTDOWN_MINUTES ?? "20",
  startupMinutes: env.STARTUP_MINUTES ?? "10",
  useFargateSpot: env.USE_FARGATE_SPOT ?? false,
  taskCpu: env.TASK_CPU,
  taskMemory: env.TASK_MEMORY,
  vpcId: env.VPC_ID ?? "",
  minecraftImageEnv: minecraftJavaImageConfigSchema.parse(
    minecraftImageConfig,
  ) satisfies Record<string, string>,
  snsEmailAddress: env.SNS_EMAIL_ADDRESS ?? "",
  twilio: {
    phoneFrom: env.TWILIO_PHONE_FROM ?? "",
    phoneTo: env.TWILIO_PHONE_TO ?? "",
    accountId: env.TWILIO_ACCOUNT_ID ?? "",
    authCode: env.TWILIO_AUTH_CODE ?? "",
  },
  debug: env.DEBUG ?? false,
});
