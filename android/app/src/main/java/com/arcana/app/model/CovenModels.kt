package com.arcana.app.model

import java.util.UUID

enum class CircleVisibility {
    Public,
    ApplicationOnly,
    Hidden
}

data class InviteToken(
    val tokenId: String = UUID.randomUUID().toString(),
    val issuerUserId: String,
    val ed25519Signature: String,
    val publicKey: String,
    val nonce: String,
    val isRedeemed: Boolean = false,
    val expiresAt: String
)

data class BarterListing(
    val id: String = UUID.randomUUID().toString(),
    val authorId: String,
    val authorArcaneName: String,
    val offeringItem: String,
    val offeringQuantity: String,
    val requestingItem: String,
    val circleVisibility: CircleVisibility = CircleVisibility.Public,
    val notes: String? = null,
    val createdAt: String
)
