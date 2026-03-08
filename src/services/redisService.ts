import { getValkeyClient } from "../common/cache/velkeyClient";

export const checkRedisConnection= async ()=>{
    const redis = getValkeyClient();
    // const cacheKey = `url:${shortCode}`;
    console.log("redis: ",JSON.stringify(redis));
    
    // const cacheKey = `url:32CGk5W`;
    // const cached = await redis.get(cacheKey);
    // console.log("cached found: ", cached);
    
    // if (cached) {
    //   return { url: cached };
    // }
    //await redis.set(cacheKey, String('https://www.npmjs.com/package/uuid#uuidv7options-buffer-offset'), "EX", 3600);
    return { url: '#' };
};