import { getValkeyClient } from "../common/cache/velkeyClient";

export const checkRedisConnection= async ()=>{
    const redis = getValkeyClient();
    //const cacheKey = `url:${shortCode}`;
    const cacheKey = `url:32CGk5W`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return { url: cached };
    }
    await redis.set(cacheKey, String('https://www.npmjs.com/package/uuid#uuidv7options-buffer-offset'), "EX", 3600);
    return redis;
};