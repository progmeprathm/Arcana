package com.arcana.app.model

import java.util.UUID

enum class FocusItem {
    Wand,
    Athame,
    Ring,
    Chalice,
    Pentacle,
    Other
}

enum class VerificationStatus {
    Guest,
    Initiate,
    Adept,
    CircleAdmin
}

data class ArcaneProfile(
    val id: String = UUID.randomUUID().toString(),
    val arcaneName: String,
    val tradition: String,
    val affinities: List<ElementalAffinity> = emptyList(),
    val focusItem: FocusItem = FocusItem.Athame,
    val verificationStatus: VerificationStatus = VerificationStatus.Initiate,
    val isProfilePublic: Boolean = false,
    val createdAt: String
)
