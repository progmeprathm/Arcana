package com.arcana.app

import com.arcana.app.domain.MatchStatus
import com.arcana.app.domain.RecipeMatcher
import com.arcana.app.model.*
import org.junit.Assert.assertEquals
import org.junit.Test

class RecipeMatcherTest {

    private val pantry = listOf(
        PantryItem(
            userId = "user1",
            name = "Mugwort",
            category = PantryCategory.Flora,
            quantity = 30.0,
            unit = "g"
        ),
        PantryItem(
            userId = "user1",
            name = "Frankincense",
            category = PantryCategory.Flora,
            quantity = 5.0,
            unit = "g"
        )
    )

    @Test
    fun testReadyToCastWhenSuppliesSufficient() {
        val recipe = SpellRecipe(
            name = "Simple Sachet",
            category = "Herbal",
            difficulty = DifficultyTier.Beginner,
            affinity = ElementalAffinity.Earth,
            durationMinutes = 10,
            instructions = listOf("Grind mugwort"),
            requiredSupplies = listOf(
                RecipeSupplyReq(name = "Mugwort", quantity = 10.0, unit = "g")
            )
        )

        val result = RecipeMatcher.evaluate(recipe, pantry)
        assertEquals(MatchStatus.ReadyToCast, result.status)
        assertEquals(0, result.missingItemsCount)
    }

    @Test
    fun testMissingOneItemWhenSingleSupplyLacking() {
        val recipe = SpellRecipe(
            name = "Threshold Cleanse",
            category = "Ward",
            difficulty = DifficultyTier.Initiate,
            affinity = ElementalAffinity.Fire,
            durationMinutes = 20,
            instructions = listOf("Burn resin and salt"),
            requiredSupplies = listOf(
                RecipeSupplyReq(name = "Frankincense", quantity = 5.0, unit = "g"),
                RecipeSupplyReq(name = "Black Salt", quantity = 10.0, unit = "g")
            )
        )

        val result = RecipeMatcher.evaluate(recipe, pantry)
        assertEquals(MatchStatus.MissingOneItem, result.status)
        assertEquals(1, result.missingItemsCount)
        assertEquals("Black Salt", result.missingDetails[0].name)
    }

    @Test
    fun testInsufficientStockWhenMultipleSuppliesMissing() {
        val recipe = SpellRecipe(
            name = "Grand Rite",
            category = "High Craft",
            difficulty = DifficultyTier.Master,
            affinity = ElementalAffinity.Aether,
            durationMinutes = 60,
            instructions = listOf("Begin high ceremony"),
            requiredSupplies = listOf(
                RecipeSupplyReq(name = "Mugwort", quantity = 100.0, unit = "g"),
                RecipeSupplyReq(name = "Black Salt", quantity = 10.0, unit = "g"),
                RecipeSupplyReq(name = "Gold Leaf", quantity = 1.0, unit = "sheet")
            )
        )

        val result = RecipeMatcher.evaluate(recipe, pantry)
        assertEquals(MatchStatus.InsufficientStock, result.status)
        assertEquals(3, result.missingItemsCount)
    }
}
