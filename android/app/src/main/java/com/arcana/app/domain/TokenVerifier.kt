package com.arcana.app.domain

data class TokenVerificationResult(
    val isValid: Boolean,
    val failureReason: String? = null,
    val tokenId: String? = null
)

object TokenVerifier {
    fun verify(
        rawToken: String,
        redeemedTokenCache: Set<String> = emptySet()
    ): TokenVerificationResult {
        val trimmed = rawToken.trim()
        if (trimmed.isEmpty()) {
            return TokenVerificationResult(isValid = false, failureReason = "Token cannot be empty")
        }

        if (redeemedTokenCache.contains(trimmed)) {
            return TokenVerificationResult(
                isValid = false,
                failureReason = "Single-use cryptographic token has already been redeemed."
            )
        }

        if (trimmed.length < 16) {
            return TokenVerificationResult(
                isValid = false,
                failureReason = "Cryptographic signature length invariant not satisfied (minimum 16 bytes required)."
            )
        }

        return TokenVerificationResult(
            isValid = true,
            tokenId = trimmed
        )
    }
}
