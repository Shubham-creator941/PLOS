/**
 * auth.helper.ts
 * Shared helpers for generating JWT tokens in tests
 * without needing a real database connection.
 */
import { generateToken } from '../../../utils/jwt';

/**
 * Returns a valid Bearer token string for use in Authorization headers.
 * @param learnerId – UUID of the test learner
 * @param role      – optional role
 */
export function makeAuthToken(learnerId: string, role = 'learner'): string {
  return `Bearer ${generateToken({ id: learnerId, role })}`;
}

/** Canonical test learner ID used across all tests. */
export const TEST_LEARNER_ID = '11111111-1111-4111-a111-111111111111';
/** A second learner used for ownership / authorization tests. */
export const OTHER_LEARNER_ID = '22222222-2222-4222-a222-222222222222';

export const TEST_TOKEN = makeAuthToken(TEST_LEARNER_ID);
export const OTHER_TOKEN = makeAuthToken(OTHER_LEARNER_ID);
