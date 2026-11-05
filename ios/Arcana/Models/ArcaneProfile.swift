import Foundation

public enum FocusItem: String, Codable, CaseIterable {
    case wand = "Wand"
    case athame = "Athame"
    case ring = "Ring"
    case chalice = "Chalice"
    case pentacle = "Pentacle"
    case other = "Other"
}

public enum VerificationStatus: String, Codable, CaseIterable {
    case guest = "Guest"
    case initiate = "Initiate"
    case adept = "Adept"
    case circleAdmin = "CircleAdmin"
}

public struct ArcaneProfile: Identifiable, Codable {
    public let id: String
    public var arcaneName: String
    public var tradition: String
    public var affinities: [ElementalAffinity]
    public var focusItem: FocusItem
    public var verificationStatus: VerificationStatus
    public var isProfilePublic: Bool
    public var createdAt: Date

    public init(
        id: String = UUID().uuidString,
        arcaneName: String,
        tradition: String,
        affinities: [ElementalAffinity] = [],
        focusItem: FocusItem = .athame,
        verificationStatus: VerificationStatus = .initiate,
        isProfilePublic: Bool = false,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.arcaneName = arcaneName
        self.tradition = tradition
        self.affinities = affinities
        self.focusItem = focusItem
        self.verificationStatus = verificationStatus
        self.isProfilePublic = isProfilePublic
        self.createdAt = createdAt
    }
}
