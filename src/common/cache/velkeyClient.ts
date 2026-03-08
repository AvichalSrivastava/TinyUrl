import { createClient } from "redis";
import * as dotenv from 'dotenv';
dotenv.config();

//let redis: Redis;

export const getValkeyClient = async() => {
  const client = await createClient({
    url: `redis://${process.env.VALKEY_HOST}:6379`,
  })
  .on("error", (err) =>{ console.log("Redis Client Error", err); throw err;})
  .connect();
  return client;
};