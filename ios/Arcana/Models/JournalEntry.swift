import Foundation

public struct JournalEntry: Identifiable, Codable {
    public let id: String
    public let userId: String
    public var title: String
    public var rawOcrText: String?
    public var formattedBody: String
    public var linkedSpellId: String?
    public var linkedPantryIds: [String]
    public var outcomeRating: Int // 1 to 5
    public var lunarPhase: String?
    public var weatherConditions: String?
    public var createdAt: Date

    public init(
        id: String = UUID().uuidString,
        userId: String,
        title: String,
        rawOcrText: String? = nil,
        formattedBody: String,
        linkedSpellId: String? = nil,
        linkedPantryIds: [String] = [],
        outcomeRating: Int = 5,
        lunarPhase: String? = nil,
        weatherConditions: String? = nil,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.userId = userId
        self.title = title
        self.rawOcrText = rawOcrText
        self.formattedBody = formattedBody
        self.linkedSpellId = linkedSpellId
        self.linkedPantryIds = linkedPantryIds
        self.outcomeRating = outcomeRating
        self.lunarPhase = lunarPhase
        self.weatherConditions = weatherConditions
        self.createdAt = createdAt
    }
}
