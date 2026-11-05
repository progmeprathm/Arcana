import Foundation

public enum MatchStatus: String {
    case readyToCast = "Ready to Cast"
    case missingOneItem = "Missing 1 Item"
    case insufficientStock = "Insufficient Stock"
}

public struct MissingItemDetail: Equatable {
    public let name: String
    public let required: Double
    public let available: Double
    public let unit: String
}

public struct RecipeMatchResult {
    public let recipe: SpellRecipe
    public let status: MatchStatus
    public let missingItemsCount: Int
    public let missingDetails: [MissingItemDetail]
}

public struct RecipeMatcher {
    public static func evaluate(recipe: SpellRecipe, pantryItems: [PantryItem]) -> RecipeMatchResult {
        var missing: [MissingItemDetail] = []

        for req in recipe.requiredSupplies {
            let matched = pantryItems.first { item in
                if let pid = req.pantryItemId, item.id == pid {
                    return true
                }
                return item.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() ==
                       req.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
            }

            let available = matched?.quantity ?? 0.0
            if available < req.quantity {
                missing.append(
                    MissingItemDetail(
                        name: req.name,
                        required: req.quantity,
                        available: available,
                        unit: req.unit
                    )
                )
            }
        }

        let status: MatchStatus
        switch missing.count {
        case 0:
            status = .readyToCast
        case 1:
            status = .missingOneItem
        default:
            status = .insufficientStock
        }

        return RecipeMatchResult(
            recipe = recipe,
            status = status,
            missingItemsCount = missing.count,
            missingDetails = missing
        )
    }
}
