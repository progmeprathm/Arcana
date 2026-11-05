import Foundation

public enum EthicalHarvestGrade: String, Codable, CaseIterable {
    case wildcrafted = "Wildcrafted"
    case organic = "Organic"
    case artisanal = "Artisanal"
    case ethicallySourced = "EthicallySourced"
}

public struct MarketItem: Identifiable, Codable {
    public let id: String
    public var name: String
    public var botanicalName: String?
    public var category: PantryCategory
    public var unitPrice: Double
    public var currency: String
    public var unit: String
    public var packageSize: Double
    public var inStock: Bool
    public var supplierName: String
    public var provenance: String
    public var ethicalHarvestGrade: EthicalHarvestGrade
    public var description: String

    public init(
        id: String = UUID().uuidString,
        name: String,
        botanicalName: String? = nil,
        category: PantryCategory,
        unitPrice: Double,
        currency: String = "USD",
        unit: String,
        packageSize: Double,
        inStock: Bool = true,
        supplierName: String,
        provenance: String,
        ethicalHarvestGrade: EthicalHarvestGrade = .wildcrafted,
        description: String
    ) {
        self.id = id
        self.name = name
        self.botanicalName = botanicalName
        self.category = category
        self.unitPrice = unitPrice
        self.currency = currency
        self.unit = unit
        self.packageSize = packageSize
        self.inStock = inStock
        self.supplierName = supplierName
        self.provenance = provenance
        self.ethicalHarvestGrade = ethicalHarvestGrade
        self.description = description
    }
}

