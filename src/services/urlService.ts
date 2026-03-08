import { getValkeyClient } from '../common/cache/velkeyClient';
import { CREATE_URL_BODY, REDIRECT_URL_BODY , URL} from '../common/interface/url.interface';
import { generateUniqueCode } from '../common/utils/url.utils';
import { addURL, findByURLCode} from '../repository/urlMapping.repository';

export const createURLService = async (body: CREATE_URL_BODY ) : Promise<URL>=>{
    try {
        if(body && body.url){
            const shortCode = generateUniqueCode();
            const data = await addURL(shortCode, body.url);
            console.log("data: ",data);
            return { shortCode: data.shortCode, originalUrl: body.url };
        }
        throw Error('service Error')
    } catch (e){
        console.log("server seeror: ",e);
        throw Error('service exception Error')
    }
}

export const RedirectURLService = async (shortCode?: string ) : Promise<CREATE_URL_BODY>=>{
    try {
        if(shortCode){
            const redis = await getValkeyClient();
            const cacheKey = `url:${shortCode}`;
            const cached = await redis.get(cacheKey);
            console.log("cached found: ", cached);

            if (cached) {
            return { url: cached };
            }
            const Item = await findByURLCode(shortCode);
            await redis.set(
                cacheKey,
                String(Item?.originalUrl || "#"),
                {
                EX: 3600,
                }
            );
            return { url: String(Item?.originalUrl || "#") };
        }
        throw Error('service Error')
    } catch (e){
        throw Error('service exception Error')
    }
}