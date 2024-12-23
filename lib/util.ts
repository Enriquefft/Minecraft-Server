import { Port } from "aws-cdk-lib/aws-ec2";
import { Protocol } from "aws-cdk-lib/aws-ecs";
import { constants } from "./constants";
import type { MinecraftEditionConfig, StackConfig } from "./types";

const JAVA_EDITION_INGRESS_RULE_PORT = 25565;
const BEDROCK_EDITION_INGRESS_RULE_PORT = 19132;

export const isDockerInstalled = (): boolean => {
  try {
    const proc = Bun.spawnSync(["docker", "version"]);
    return proc.success;
  } catch {
    return false;
  }
};

export const getMinecraftServerConfig = (
  edition: StackConfig["minecraftEdition"],
): MinecraftEditionConfig => {
  const javaConfig = {
    image: constants.JAVA_EDITION_DOCKER_IMAGE,
    port: 25565,
    protocol: Protocol.TCP,
    ingressRulePort: Port.tcp(JAVA_EDITION_INGRESS_RULE_PORT),
  };

  const bedrockConfig = {
    image: constants.BEDROCK_EDITION_DOCKER_IMAGE,
    port: 19132,
    protocol: Protocol.UDP,
    ingressRulePort: Port.udp(BEDROCK_EDITION_INGRESS_RULE_PORT),
  };

  return edition === "java" ? javaConfig : bedrockConfig;
};
