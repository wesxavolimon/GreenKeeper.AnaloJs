import {
  isAuthenticated,
  isTokenExpired,
  validateSession,
} from './index';

describe('Auth Domain Rules', () => {
  it('returns false for null, undefined, or empty token', () => {
    expect(isAuthenticated(null)).toBe(false);
    expect(isAuthenticated(undefined)).toBe(false);
    expect(isAuthenticated('')).toBe(false);
  });

  it('returns true for a non-empty token string', () => {
    expect(isAuthenticated('abc.def.ghi')).toBe(true);
  });

  it('returns true when token is not expired', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    const token = `header.${btoa(JSON.stringify({ exp: future }))}.signature`;
    expect(isTokenExpired(token)).toBe(false);
  });

  it('returns true when token is expired', () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    const token = `header.${btoa(JSON.stringify({ exp: past }))}.signature`;
    expect(isTokenExpired(token)).toBe(true);
  });

  it('returns true when token payload has no exp field', () => {
    const token = `header.${btoa(JSON.stringify({ sub: 'user-1' }))}.signature`;
    expect(isTokenExpired(token)).toBe(true);
  });

  it('returns true when token is malformed', () => {
    expect(isTokenExpired('not-a-jwt')).toBe(true);
    expect(isTokenExpired('abc')).toBe(true);
  });

  it('validateSession returns false for missing token', () => {
    expect(validateSession(null)).toBe(false);
    expect(validateSession(undefined)).toBe(false);
    expect(validateSession('')).toBe(false);
  });

  it('validateSession returns true for valid non-expired token', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    const token = `header.${btoa(JSON.stringify({ exp: future }))}.signature`;
    expect(validateSession(token)).toBe(true);
  });

  it('validateSession returns false for expired token', () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    const token = `header.${btoa(JSON.stringify({ exp: past }))}.signature`;
    expect(validateSession(token)).toBe(false);
  });
});
