import { v7 as uuidv7 } from 'uuid';

  const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function encodeBase62(num: bigint): string {
      let result = "";
      while (num > 0n) {
          const remainder = num % 62n;
          result = BASE62[Number(remainder)] + result;
          num = num / 62n;
      }
      return result;
  }
  export const generateUniqueCode=()=>{
      const uuid = uuidv7().replace(/-/g, "");
      const bigint = BigInt("0x" + uuid);
      const base62 = encodeBase62(bigint);
      return base62.slice(0, 7);
  }