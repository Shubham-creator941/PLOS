/**
 * src/shared/errors.ts
 * Typed HTTP error classes.
 *
 * Services throw these instead of plain `Error` so the global error handler
 * can map them to correct HTTP status codes without string-matching.
 */

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
    // Maintain proper prototype chain in transpiled ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 400 Bad Request */
export class BadRequestError extends AppError {
  constructor(msg = 'Bad request') { super(400, msg); }
}

/** 401 Unauthorized */
export class UnauthorizedError extends AppError {
  constructor(msg = 'Authentication required') { super(401, msg); }
}

/** 403 Forbidden */
export class ForbiddenError extends AppError {
  constructor(msg = 'You do not have permission to perform this action') { super(403, msg); }
}

/** 404 Not Found */
export class NotFoundError extends AppError {
  constructor(msg = 'Resource not found') { super(404, msg); }
}

/** 409 Conflict — optimistic locking or duplicate */
export class ConflictError extends AppError {
  constructor(msg = 'Conflict: resource was modified by another request') { super(409, msg); }
}

/** 422 Unprocessable */
export class UnprocessableError extends AppError {
  constructor(msg = 'Unprocessable entity') { super(422, msg); }
}
