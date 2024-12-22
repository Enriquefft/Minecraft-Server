#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MinecraftServerStack } from "../lib/minecraft-server-stack.ts";
import { env } from "../env.ts";

const app = new cdk.App();

export const stack = new MinecraftServerStack(app, "MinecraftServerStack", {
  /*
   * If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere.
   */
  /*
   * Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration.
   */
  env: { account: env.CDK_DEFAULT_ACCOUNT, region: env.CDK_DEFAULT_REGION },
  /*
   * Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to.
   */
  // Env: { account: "971422703566", region: "us-east-1" },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
