package com.arcana.app.domain

import com.arcana.app.model.PantryItem
import com.arcana.app.model.SpellRecipe

enum class MatchStatus {
    ReadyToCast,
    MissingOneItem,
    InsufficientStock
}

data class MissingRequirement(
    val name: String,
    val required: Double,
    val available: Double,
    val unit: String
)

data class RecipeMatchResult(
    val recipe: SpellRecipe,
    val status: MatchStatus,
    val missingItemsCount: Int,
    val missingDetails: List<MissingRequirement>
)

object RecipeMatcher {
    fun evaluate(recipe: SpellRecipe, pantryItems: List<PantryItem>): RecipeMatchResult {
        val missing = mutableListOf<MissingRequirement>()

        for (req in recipe.requiredSupplies) {
            val matched = pantryItems.firstOrNull { item ->
                (req.pantryItemId != null && item.id == req.pantryItemId) ||
                item.name.equals(req.name.trim(), ignoreCase = true)
            }
            val available = matched?.quantity ?: 0.0
            if (available < req.quantity) {
                missing.add(
                    MissingRequirement(
                        name = req.name,
                        required = req.quantity,
                        available = available,
                        unit = req.unit
                    )
                )
            }
        }

        val status = when (missing.size) {
            0 -> MatchStatus.ReadyToCast
            1 -> MatchStatus.MissingOneItem
            else -> MatchStatus.InsufficientStock
        }

        return RecipeMatchResult(
            recipe = recipe,
            status = status,
            missingItemsCount = missing.size,
            missingDetails = missing
        )
    }
}
