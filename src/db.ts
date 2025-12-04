import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const ddb = DynamoDBDocumentClient.from(client);

export const getAllQuotes = async (tableName: string) => {
  const result = await ddb.send(
    new ScanCommand({
      TableName: tableName,
    })
  );

  return result.Items ?? [];
};
