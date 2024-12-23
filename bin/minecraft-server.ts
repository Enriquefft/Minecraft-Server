#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MinecraftServerStack } from "../lib/minecraft-server-stack.ts";
import { DomainStack } from "../lib/domain-stack";
import { constants } from "../lib/constants";
import { resolveConfig } from "../lib/config";
import { env } from "../env.ts";

const app = new cdk.App();

const config = resolveConfig();

if (!config.domainName) {
  throw new Error(
    "Missing required `DOMAIN_NAME` in .env file, please rename\
    `.env.sample` to `.env` and add your domain name.",
  );
}

const domainStack = new DomainStack(app, "minecraft-domain-stack", {
  env: {
    /**
     * Because we are relying on Route 53+CloudWatch to invoke the Lambda function,
     * it _must_ reside in the N. Virginia (us-east-1) region.
     */
    region: constants.DOMAIN_STACK_REGION,
    /* Account must be specified to allow for hosted zone lookup */
    account: env.CDK_DEFAULT_ACCOUNT,
  },
  config,
});

const minecraftStack = new MinecraftServerStack(app, "minecraft-server-stack", {
  env: {
    region: config.serverRegion,
    /* Account must be specified to allow for VPC lookup */
    account: env.CDK_DEFAULT_ACCOUNT,
  },
  config,
});

minecraftStack.addDependency(domainStack);
