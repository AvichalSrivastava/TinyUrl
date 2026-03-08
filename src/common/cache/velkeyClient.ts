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

  }

  return redis;
};