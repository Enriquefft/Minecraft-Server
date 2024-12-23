/* eslint-disable @typescript-eslint/naming-convention */
import { custom_resources as cr } from "aws-cdk-lib";
import type { Construct } from "constructs";

interface SSMParameterReaderProps {
  parameterName: string;
  region: string;
}

export class SSMParameterReader extends cr.AwsCustomResource {
  public constructor(
    scope: Construct,
    name: string,
    props: SSMParameterReaderProps,
  ) {
    const { parameterName, region } = props;

    const ssmAwsSdkCall: cr.AwsSdkCall = {
      service: "SSM",
      action: "getParameter",
      parameters: {
        Name: parameterName,
      },
      region,
      /* Update physical id to always fetch the latest version */
      physicalResourceId: { id: `SSMParam-${parameterName}-${Date.now()}` },
    };

    super(scope, name, {
      onUpdate: ssmAwsSdkCall,
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }

  public getParameterValue(): string {
    return this.getResponseField("Parameter.Value").toString();
  }
}
