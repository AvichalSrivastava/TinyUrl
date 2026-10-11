import { Context, APIGatewayProxyEvent, APIGatewayProxyResult  } from 'aws-lambda';
import { ValidationError } from '../common/errors/app.error';
import { CREATE_URL_BODY } from '../common/interface/url.interface';
import { createURLService } from '../services/urlService';

const parseBody = (raw: string | null): CREATE_URL_BODY => {
    try {
        return JSON.parse(raw ?? '{}');
    } catch {
        throw new ValidationError('Request body must be valid JSON');
    }
};

export const createUrlHandler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    const data = await createURLService(parseBody(event.body));
    return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
};
