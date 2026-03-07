import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { checkRedisConnection } from "../services/redisService";

export const RedisConnectHandler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    try {
        const redis = await checkRedisConnection();
        return {
            statusCode: 200,
            body: JSON.stringify(redis)
        }
    } catch(e){
        return {
            statusCode: 500,
            body: JSON.stringify(e)
        }
    }
}