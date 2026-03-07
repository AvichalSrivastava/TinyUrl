import Redis from "ioredis";
import * as dotenv from 'dotenv';
dotenv.config();

let redis: Redis;

export const getValkeyClient = () => {
  if (!redis) {
      redis = new Redis({
        host: process.env.VALKEY_HOST,
        port: 6379,
        maxRetriesPerRequest: 1
      });
  }
  redis.on("connect", () => {
    console.log("Connected to Redis");
  });
  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });
  return redis;
};