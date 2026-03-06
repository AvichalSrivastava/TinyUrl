import { DynamoDBClient  } from "@aws-sdk/client-dynamodb";
import {  PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

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

  try {
    await client.send(new PutCommand(params));

    return {
      shortCode: code,
      originalUrl: url
    };

  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
}

export async function findByURLCode(code: string) {
  const params = {
    TableName: "UrlMappings",
    Key: {
      shortCode: code
    }
  };

  try {
    const command = new GetCommand (params);
    const data = await client.send(command);
    console.log("data", data.Item);
    return data.Item;
  } catch (err) {
    console.error("DB Error: ", err);
  }
};
