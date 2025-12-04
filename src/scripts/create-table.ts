import dotenv from "dotenv";
dotenv.config();
import type { CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const TABLE = process.env.DYNAMO_TABLE as string;
const REGION = process.env.AWS_REGION as string;

if (!TABLE || !REGION) {
  console.error("Missing environment variables. Check DYNAMO_TABLE and AWS_REGION.");
  process.exit(1);
}

const client = new DynamoDBClient({ region: REGION });

const params:CreateTableCommandInput = {
  TableName: TABLE,
  AttributeDefinitions: [
    { AttributeName: "quoteId", AttributeType: "S" }
  ],
  KeySchema: [
    { AttributeName: "quoteId", KeyType: "HASH" }
  ],
  BillingMode: "PAY_PER_REQUEST"
} ;

async function createTable() {
  try {
    console.log(`Creating table: ${TABLE}`);
    const result = await client.send(new CreateTableCommand(params));
    console.log("Table creation initiated:", result.TableDescription?.TableName);
    console.log("Status:", result.TableDescription?.TableStatus);
  } catch (err: any) {
    console.error("Error creating table:", err.name, err.message);
  }
}

createTable();
