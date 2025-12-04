


import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as path from "path";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const table = new Table(this, "QuotesTable", {
      tableName: "Quotes",
      partitionKey: { name: "quoteId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    // Lambda function
    const quoteLambda = new NodejsFunction(this, "QuoteHandler", {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../../src/handler.ts"),
      handler: "handler",
      environment: {
        DYNAMO_TABLE: table.tableName,
      },
      bundling: {
        minify: true
      }
    });

    // Grant Lambda read access to DynamoDB
    table.grantReadData(quoteLambda);

    // HTTP API
    const api = new HttpApi(this, "QuoteApi", {
      apiName: "quote-of-the-day-api"
    });

    // Correct integration for CDK v2
    const integration = new HttpLambdaIntegration(
      "QuoteIntegration",
      quoteLambda
    );

    api.addRoutes({
      path: "/quote",
      methods: [HttpMethod.GET],
      integration
    });

    // Output API endpoint
    new CfnOutput(this, "ApiEndpoint", {
      value: api.apiEndpoint
    });
  }
}
