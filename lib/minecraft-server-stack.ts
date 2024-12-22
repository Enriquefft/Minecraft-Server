import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
// Import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MinecraftServerStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    /*
     * Example resource
     * const queue = new sqs.Queue(this, 'MinecraftServerQueue', {
     *   visibilityTimeout: cdk.Duration.seconds(300)
     * });
     */
  }
}
