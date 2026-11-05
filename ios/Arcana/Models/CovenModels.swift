import Foundation

public enum CircleVisibility: String, Codable, CaseIterable {
    case `public` = "Public"
    case applicationOnly = "ApplicationOnly"
    case hidden = "Hidden"
}

public struct InviteToken: Identifiable, Codable {
    public var id: String { tokenId }
    public let tokenId: String
    public let issuerUserId: String
    public let ed25519Signature: String
    public let publicKey: String
    public let nonce: String
    public var isRedeemed: Bool
    public let expiresAt: Date

    public init(
        tokenId: String = UUID().uuidString,
        issuerUserId: String,
        ed25519Signature: String,
        publicKey: String,
        nonce: String,
        isRedeemed: Bool = false,
        expiresAt: Date = Date().addingTimeInterval(86400 * 7)
    ) {
        self.tokenId = tokenId
        self.issuerUserId = issuerUserId
        self.ed25519Signature = ed25519Signature
        self.publicKey = publicKey
        self.nonce = nonce
        self.isRedeemed = isRedeemed
        self.expiresAt = expiresAt
    }
}

public struct BarterListing: Identifiable, Codable {
    public let id: String
    public let authorId: String
    public let authorArcaneName: String
    public var offeringItem: String
    public var offeringQuantity: String
    public var requestingItem: String
    public var circleVisibility: CircleVisibility
    public var notes: String?
    public let createdAt: Date

    public init(
        id: String = UUID().uuidString,
        authorId: String,
        authorArcaneName: String,
        offeringItem: String,
        offeringQuantity: String,
        requestingItem: String,
        circleVisibility: CircleVisibility = .public,
        notes: String? = nil,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.authorId = authorId
        self.authorArcaneName = authorArcaneName
        self.offeringItem = offeringItem
        self.offeringQuantity = offeringQuantity
        self.requestingItem = requestingItem
        self.circleVisibility = circleVisibility
        self.notes = notes
        self.createdAt = createdAt
    }
}
