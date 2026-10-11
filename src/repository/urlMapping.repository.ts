import { DynamoDBClient  } from "@aws-sdk/client-dynamodb";
import {  PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

// Throws ConditionalCheckFailedException if the short code is already taken
export async function addURL(code: string, url: string) {
  const params = {
    TableName: "UrlMappings",
    Item: {
      shortCode: code,
      originalUrl: url,
      createdAt: new Date().toISOString()
    },

    ConditionExpression: "attribute_not_exists(shortCode)"
  };

  await client.send(new PutCommand(params));

  return {
    shortCode: code,
    originalUrl: url
  };
}

// Returns undefined when the code does not exist. DynamoDB errors propagate to the caller,
// so a transient failure is never mistaken for (and cached as) "not found".
export async function findByURLCode(code: string) {
  const params = {
    TableName: "UrlMappings",
    Key: {
      shortCode: code
    }
  };

  const data = await client.send(new GetCommand(params));
  return data.Item;
};
