import Foundation

public enum DifficultyTier: String, Codable, CaseIterable {
    case beginner = "Beginner"
    case initiate = "Initiate"
    case adept = "Adept"
    case master = "Master"
}

public enum ElementalAffinity: String, Codable, CaseIterable {
    case earth = "Earth"
    case air = "Air"
    case fire = "Fire"
    case water = "Water"
    case aether = "Aether"
}

public struct RecipeSupplyReq: Codable, Identifiable {
    public var id: String { name }
    public let pantryItemId: String?
    public let name: String
    public let quantity: Double
    public let unit: String

    public init(pantryItemId: String? = nil, name: String, quantity: Double, unit: String) {
        self.pantryItemId = pantryItemId
        self.name = name
        self.quantity = quantity
        self.unit = unit
    }
}

public struct SpellRecipe: Identifiable, Codable {
    public let id: String
    public var name: String
    public var category: String
    public var difficulty: DifficultyTier
    public var affinity: ElementalAffinity
    public var durationMinutes: Int
    public var safetyWarnings: [String]
    public var instructions: [String]
    public var requiredSupplies: [RecipeSupplyReq]

    public init(
        id: String = UUID().uuidString,
        name: String,
        category: String,
        difficulty: DifficultyTier,
        affinity: ElementalAffinity,
        durationMinutes: Int,
        safetyWarnings: [String] = [],
        instructions: [String],
        requiredSupplies: [RecipeSupplyReq]
    ) {
        self.id = id
        self.name = name
        self.category = category
        self.difficulty = difficulty
        self.affinity = affinity
        self.durationMinutes = durationMinutes
        self.safetyWarnings = safetyWarnings
        self.instructions = instructions
        self.requiredSupplies = requiredSupplies
    }
}
