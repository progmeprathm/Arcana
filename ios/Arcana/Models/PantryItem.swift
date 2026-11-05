import Foundation

public enum PantryCategory: String, Codable, CaseIterable {
    case flora = "Flora"
    case fauna = "Fauna"
    case mineral = "Mineral"
    case tool = "Tool"
}

public struct PantryItem: Identifiable, Codable {
    public let id: String
    public let userId: String
    public var name: String
    public var category: PantryCategory
    public var quantity: Double
    public var unit: String
    public var harvestDate: Date?
    public var lunarPhase: String?
    public var minThreshold: Double
    public var shelfLifeDays: Int?
    public var notes: String

    public init(
        id: String = UUID().uuidString,
        userId: String,
        name: String,
        category: PantryCategory,
        quantity: Double,
        unit: String,
        harvestDate: Date? = nil,
        lunarPhase: String? = nil,
        minThreshold: Double = 0.0,
        shelfLifeDays: Int? = nil,
        notes: String = ""
    ) {
        self.id = id
        self.userId = userId
        self.name = name
        self.category = category
        self.quantity = quantity
        self.unit = unit
        self.harvestDate = harvestDate
        self.lunarPhase = lunarPhase
        self.minThreshold = minThreshold
        self.shelfLifeDays = shelfLifeDays
        self.notes = notes
    }

    public var isLowStock: BooleanLiteralType {
        return quantity <= minThreshold
    }
}
