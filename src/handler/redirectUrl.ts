import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RedirectURLService } from '../services/urlService';

export const RedirectUrlHandler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    const shortCode = event.pathParameters?.shortCode;
    console.log("{shortCode}: ",shortCode)
    const url = await RedirectURLService(shortCode);
    return {
        statusCode: 302,
        headers: {
        Location: url
        },
        body: ""
    };
};
