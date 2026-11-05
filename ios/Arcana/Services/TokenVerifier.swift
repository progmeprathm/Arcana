import Foundation

public struct TokenVerificationResult {
    public let isValid: Bool
    public let failureReason: String?
    public let tokenId: String?
}

public struct TokenVerifier {
    public static func verify(
        rawToken: String,
        redeemedTokenCache: Set<String> = []
    ) -> TokenVerificationResult {
        let trimmed = rawToken.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            return TokenVerificationResult(isValid: false, failureReason: "Token cannot be empty", tokenId: nil)
        }

        if redeemedTokenCache.contains(trimmed) {
            return TokenVerificationResult(
                isValid: false,
                failureReason: "Single-use cryptographic token has already been redeemed.",
                tokenId: nil
            )
        }

        if trimmed.count < 16 {
            return TokenVerificationResult(
                isValid: false,
                failureReason: "Cryptographic signature length invariant not satisfied (minimum 16 bytes required).",
                tokenId: nil
            )
        }

        return TokenVerificationResult(
            isValid: true,
            failureReason: nil,
            tokenId: trimmed
        )
    }
}
