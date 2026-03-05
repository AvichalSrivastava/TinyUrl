// src/handler.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createUrlHandler } from "./createUrl";
import { RedirectUrlHandler } from "./redirectUrl";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  try {
    const routeKey = `${event.httpMethod} ${event.resource}`;
    console.log("routeKey: ",routeKey);
    
    switch (routeKey) {
    case "POST /shorten":
        return createUrlHandler(event);

    case "GET /{shortCode}":
        return RedirectUrlHandler(event);

    default:
        return {
        statusCode: 404,
        body: "Not Found"
        };
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