import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { checkRedisConnection } from "../services/redisService";

export const RedisConnectHandler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    try {
        const response = await checkRedisConnection();
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    } catch(e){
        console.log("RedisConnectHandler error: ",e.message ?? '')
        return {
            statusCode: 500,
            body: JSON.stringify(e.message)
        }
    }
}