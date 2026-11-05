package com.arcana.app.model

import java.util.UUID

data class JournalEntry(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val title: String,
    val rawOcrText: String? = null,
    val formattedBody: String,
    val linkedSpellId: String? = null,
    val linkedPantryIds: List<String> = emptyList(),
    val outcomeRating: Int = 5,
    val lunarPhase: String? = null,
    val weatherConditions: String? = null,
    val createdAt: String
)
