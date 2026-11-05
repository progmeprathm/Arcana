import XCTest
@testable import Arcana

final class RecipeMatcherTests: XCTestCase {

    private let samplePantry: [PantryItem] = [
        PantryItem(
            userId: "u1",
            name: "Mugwort",
            category: .flora,
            quantity: 30.0,
            unit: "g"
        ),
        PantryItem(
            userId: "u1",
            name: "Frankincense",
            category: .flora,
            quantity: 5.0,
            unit: "g"
        )
    ]

    func testReadyToCastWhenSuppliesAvailable() {
        let recipe = SpellRecipe(
            name = "Dream Sachet",
            category = "Sleep",
            difficulty = .beginner,
            affinity = .water,
            durationMinutes = 15,
            instructions = ["Blend herbs"],
            requiredSupplies = [
                RecipeSupplyReq(name: "Mugwort", quantity: 10.0, unit: "g")
            ]
        )

        let result = RecipeMatcher.evaluate(recipe: recipe, pantryItems: samplePantry)
        XCTAssertEqual(result.status, .readyToCast)
        XCTAssertEqual(result.missingItemsCount, 0)
    }

    func testMissingOneItemWhenSingleSupplyDeficit() {
        let recipe = SpellRecipe(
            name = "Ward Blend",
            category = "Protection",
            difficulty = .initiate,
            affinity = .fire,
            durationMinutes = 20,
            instructions = ["Burn resin"],
            requiredSupplies = [
                RecipeSupplyReq(name: "Frankincense", quantity: 5.0, unit: "g"),
                RecipeSupplyReq(name: "Black Salt", quantity: 15.0, unit: "g")
            ]
        )

        let result = RecipeMatcher.evaluate(recipe: recipe, pantryItems: samplePantry)
        XCTAssertEqual(result.status, .missingOneItem)
        XCTAssertEqual(result.missingItemsCount, 1)
        XCTAssertEqual(result.missingDetails.first?.name, "Black Salt")
    }

    func testInsufficientStockWhenMultipleSuppliesMissing() {
        let recipe = SpellRecipe(
            name = "Adept Consecration",
            category = "Ritual",
            difficulty = .adept,
            affinity = .aether,
            durationMinutes = 45,
            instructions = ["High ritual"],
            requiredSupplies = [
                RecipeSupplyReq(name: "Mugwort", quantity: 50.0, unit: "g"),
                RecipeSupplyReq(name: "Gold Leaf", quantity: 2.0, unit: "sheets"),
                RecipeSupplyReq(name: "Rose Water", quantity: 100.0, unit: "ml")
            ]
        )

        let result = RecipeMatcher.evaluate(recipe: recipe, pantryItems: samplePantry)
        XCTAssertEqual(result.status, .insufficientStock)
        XCTAssertEqual(result.missingItemsCount, 3)
    }
}
