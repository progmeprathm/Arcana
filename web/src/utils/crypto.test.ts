import { describe, it, expect } from 'vitest';
import { validateInviteToken } from './crypto';

describe('Ed25519 Cryptographic Invite Token Verification', () => {
  const redeemedSet = new Set<string>(['TOKEN-ALREADY-USED-123']);

  it('rejects empty or whitespace token', () => {
    const res = validateInviteToken('   ', redeemedSet);
    expect(res.valid).toBe(false);
    expect(res.reason).toContain('cannot be empty');
  });

  it('rejects already redeemed token (single-use integrity)', () => {
    const res = validateInviteToken('TOKEN-ALREADY-USED-123', redeemedSet);
    expect(res.valid).toBe(false);
    expect(res.reason).toContain('already been redeemed');
  });

  it('rejects tokens that are too short to contain cryptographic signature', () => {
    const res = validateInviteToken('short-token', redeemedSet);
    expect(res.valid).toBe(false);
    expect(res.reason).toContain('Malformed cryptographic signature');
  });

  it('accepts valid cryptographic token and parses payload', () => {
    const validRaw = 'ARCANA-ED25519-SIG-COVEN-INITIATE-998877';
    const res = validateInviteToken(validRaw, redeemedSet);
    expect(res.valid).toBe(true);
    expect(res.token?.token_id).toBe(validRaw);
    expect(res.token?.is_redeemed).toBe(false);
  });
});
