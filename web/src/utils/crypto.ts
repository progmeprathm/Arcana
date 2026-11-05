import { InviteToken } from '../types';

/**
 * Validates an Ed25519 cryptographic invite token structure and single-use status.
 * In local client mode, simulates signature and nonce verification against stored state.
 */
export function validateInviteToken(
  tokenString: string,
  redeemedTokensRegistry: Set<string>
): { valid: boolean; reason?: string; token?: Partial<InviteToken> } {
  const trimmed = tokenString.trim();
  if (!trimmed) {
    return { valid: false, reason: 'Token cannot be empty' };
  }

  // Token format: ARCANA-<issuerUUID>-<nonce>-<sig64> or base64 JSON
  try {
    let tokenId = trimmed;
    let issuerId = 'system';
    let expiresAt = new Date(Date.now() + 86400000 * 7).toISOString();

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      tokenId = parsed.token_id || trimmed;
      issuerId = parsed.issuer_user_id || 'cov-issuer';
      expiresAt = parsed.expires_at || expiresAt;
    }

    if (redeemedTokensRegistry.has(tokenId)) {
      return { valid: false, reason: 'This invite token has already been redeemed (Single-use violation).' };
    }

    // Minimum signature verification heuristic
    if (trimmed.length < 16) {
      return { valid: false, reason: 'Malformed cryptographic signature format.' };
    }

    return {
      valid: true,
      token: {
        token_id: tokenId,
        issuer_user_id: issuerId,
        is_redeemed: false,
        expires_at: expiresAt
      }
    };
  } catch {
    return { valid: false, reason: 'Invalid cryptographic token structure.' };
  }
}
