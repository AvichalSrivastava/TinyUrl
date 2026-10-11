export interface UrlMapping {
    shortCode: string;
    originalUrl: string;
}

export interface CREATE_URL_BODY {
    url?: string;
}

export interface REDIRECT_URL_BODY {
    code?: string;
}
