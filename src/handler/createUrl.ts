import { Context, APIGatewayProxyEvent, APIGatewayProxyResult  } from 'aws-lambda';
import { CREATE_URL_BODY } from '../common/interface/url.interface';
import { createURLService } from '../services/urlService';

export const createUrlHandler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    const body : CREATE_URL_BODY = JSON.parse(event.body ?? '{}');
    const data =  await createURLService(body);
    return {
        statusCode: 201,
        body: JSON.stringify(data)
    };
};