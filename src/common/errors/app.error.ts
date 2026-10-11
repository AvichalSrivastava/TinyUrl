// Errors that map to a specific HTTP status. Anything else becomes a 500 in the router.
export class AppError extends Error {
    constructor(public readonly statusCode: number, message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Short URL not found') {
        super(404, message);
    }
}
