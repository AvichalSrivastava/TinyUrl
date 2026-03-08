import Redis from "ioredis";
import * as dotenv from 'dotenv';
dotenv.config();

let redis: Redis;

export const getValkeyClient = () => {
  if (!redis) {
    redis = new Redis({
      host: process.env.VALKEY_HOST,
      port: 6379,
      lazyConnect: true,
      //enableOfflineQueue: false,
      maxRetriesPerRequest: 3,
      connectTimeout: 2000
    });

    redis.on("connect", async() => {
      console.log("Connected to Redis");
      console.log("redis: ",JSON.stringify(redis));
    
      const cacheKey = `url:32CGk5W`;
      const cached = await redis.get(cacheKey);
      console.log("cached found: ", cached);
      
      if (cached) {
        return { url: cached };
      }
      await redis.set(cacheKey, String('https://www.npmjs.com/package/uuid#uuidv7options-buffer-offset'), "EX", 3600);
    });

    redis.on("error", (err) => {
      console.error("Redis error:", err);
      throw err;
    });
  }

  return redis;
};