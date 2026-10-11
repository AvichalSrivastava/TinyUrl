// src/handler.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AppError } from "../common/errors/app.error";
import { createUrlHandler } from "./createUrl";
import { RedirectUrlHandler } from "./redirectUrl";
import { RedisConnectHandler } from './redisConnect'

const jsonResponse = (statusCode: number, body: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  try {
    const routeKey = `${event.httpMethod} ${event.resource}`;
    console.log("routeKey: ",routeKey);

    // `return await` so rejections are caught below instead of escaping as a Lambda error (502)
    switch (routeKey) {
    case "POST /shorten":
        return await createUrlHandler(event);

    case "GET /{shortCode}":
        return await RedirectUrlHandler(event);

    case "GET /redis":
        return await RedisConnectHandler(event);

    default:
        return jsonResponse(404, { message: "Not Found" });
    }

  } catch (error) {
    if (error instanceof AppError) {
      return jsonResponse(error.statusCode, { message: error.message });
    }
    console.error("Unhandled error:", error);
    return jsonResponse(500, { message: "Something went wrong" });
  }
};
