/**
 * src/utils/jwt.ts
 * JWT utilities — algorithm pinned to HS256 to prevent algorithm-confusion attacks.
 * expiresIn reads from env.JWT_EXPIRES_IN.
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  id:    string;
  role?: string;
}

/**
 * Sign a JWT.
 * @param payload   – data to embed
 * @param expiresIn – defaults to env.JWT_EXPIRES_IN (e.g. '7d')
 */
export const generateToken = (
  payload: TokenPayload,
  expiresIn: SignOptions['expiresIn'] = env.JWT_EXPIRES_IN as SignOptions['expiresIn']
): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
    algorithm: 'HS256'   // ← pinned: prevents algorithm-confusion attacks
  });
};

/**
 * Verify and decode a JWT.
 * Rejects tokens signed with any algorithm other than HS256.
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: ['HS256']   // ← whitelist only
  }) as TokenPayload;
};
