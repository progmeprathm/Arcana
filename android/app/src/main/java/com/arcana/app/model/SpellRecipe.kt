package com.arcana.app.model

import java.util.UUID

enum class DifficultyTier {
    Beginner,
    Initiate,
    Adept,
    Master
}

enum class ElementalAffinity {
    Earth,
    Air,
    Fire,
    Water,
    Aether
}

data class RecipeSupplyReq(
    val pantryItemId: String? = null,
    val name: String,
    val quantity: Double,
    val unit: String
)

data class SpellRecipe(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val category: String,
    val difficulty: DifficultyTier,
    val affinity: ElementalAffinity,
    val durationMinutes: Int,
    val safetyWarnings: List<String> = emptyList(),
    val instructions: List<String>,
    val requiredSupplies: List<RecipeSupplyReq>
)
