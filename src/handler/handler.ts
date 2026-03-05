// src/handler.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createUrlHandler } from "./createUrl";
import { RedirectUrlHandler } from "./redirectUrl";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  try {
    const method = event.httpMethod;
    const path = event.path;
    console.log("httpMethod:", event.httpMethod);
    console.log("resource:", event.resource);
    console.log("path:", event.path);
    
    if (method === "POST" && path.endsWith("/shorten")) {
      return createUrlHandler(event);
    }

    if (method === "GET") {
      return RedirectUrlHandler(event);
    }

      return {
        statusCode: 404,
        body: "Not Found"
      };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
};