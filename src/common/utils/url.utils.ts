import { randomInt } from 'crypto';

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SHORT_CODE_LENGTH = 7;
const SHORT_CODE_PATTERN = /^[0-9a-zA-Z]{7}$/;
export const MAX_URL_LENGTH = 2048;

// 7 random base62 characters = 62^7 (~3.5 trillion) codes.
// Uniqueness is enforced by the conditional put in the repository, not here.
export const generateShortCode = (): string => {
    let code = "";
    for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
        code += BASE62[randomInt(62)];
    }
    return code;
};

export const isValidShortCode = (code?: string): code is string =>
    !!code && SHORT_CODE_PATTERN.test(code);

export const isValidHttpUrl = (value: string): boolean => {
    if (value.length > MAX_URL_LENGTH) {
        return false;
    }
    try {
        const { protocol } = new URL(value);
        return protocol === 'http:' || protocol === 'https:';
    } catch {
        return false;
    }
};
