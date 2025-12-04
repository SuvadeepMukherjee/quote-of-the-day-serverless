import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import sampleQuotes from "./sample-quotes.json";
import dotenv from "dotenv";
dotenv.config();

const TABLE = process.env.DYNAMO_TABLE as string;

if (!TABLE) {
  console.error("Missing DYNAMO_TABLE environment variable.");
  process.exit(1);
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const ddb = DynamoDBDocumentClient.from(client);

const run = async () => {
  console.log("Seeding quotes into table:", TABLE);

  for (const quote of sampleQuotes) {
    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: quote,
      })
    );
    console.log("Inserted:", quote.text);
  }

  console.log("Seeding complete.");
};

run().catch((err) => {
  console.error("Seed script error:", err);
  process.exit(1);
});
