import { getValkeyClient } from '../common/cache/velkeyClient';
import { NotFoundError, ValidationError } from '../common/errors/app.error';
import { CREATE_URL_BODY, UrlMapping } from '../common/interface/url.interface';
import { generateShortCode, isValidHttpUrl, isValidShortCode, MAX_URL_LENGTH } from '../common/utils/url.utils';
import { addURL, findByURLCode } from '../repository/urlMapping.repository';

const MAX_CREATE_ATTEMPTS = 3;
const CACHE_TTL_SECONDS = 3600;
// Earlier versions cached "#" for unknown codes. Treat it as a miss until those entries expire.
const LEGACY_NOT_FOUND = '#';

export const createURLService = async (body: CREATE_URL_BODY): Promise<UrlMapping> => {
    const url = typeof body?.url === 'string' ? body.url.trim() : '';
    if (!isValidHttpUrl(url)) {
        throw new ValidationError(`url must be an absolute http(s) URL of at most ${MAX_URL_LENGTH} characters`);
    }

    let attempt = 1;
    while (true) {
        try {
            return await addURL(generateShortCode(), url);
        } catch (e) {
            const isCollision = (e as Error)?.name === 'ConditionalCheckFailedException';
            if (!isCollision || attempt >= MAX_CREATE_ATTEMPTS) {
                throw e;
            }
            console.warn(`Short code collision, retrying (attempt ${attempt} of ${MAX_CREATE_ATTEMPTS})`);
            attempt++;
        }
    }
};

export const RedirectURLService = async (shortCode?: string): Promise<string> => {
    // Reject malformed codes (e.g. /favicon.ico) before touching the cache or the table
    if (!isValidShortCode(shortCode)) {
        throw new NotFoundError();
    }

    const redis = await getValkeyClient();
    const cacheKey = `url:${shortCode}`;
    const cached = await redis.get(cacheKey);
    if (cached !== null && cached !== LEGACY_NOT_FOUND) {
        return cached;
    }

    const item = await findByURLCode(shortCode);
    if (!item?.originalUrl) {
        throw new NotFoundError();
    }

    await redis.set(cacheKey, item.originalUrl, { EX: CACHE_TTL_SECONDS });
    return item.originalUrl;
};
