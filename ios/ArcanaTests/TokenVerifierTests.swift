import XCTest
@testable import Arcana

final class TokenVerifierTests: XCTestCase {

    private let redeemedSet: Set<String> = ["TOKEN-ALREADY-USED-9988"]

    func testEmptyTokenRejected() {
        let res = TokenVerifier.verify(rawToken: "   ", redeemedTokenCache: redeemedSet)
        XCTAssertFalse(res.isValid)
        XCTAssertEqual(res.failureReason, "Token cannot be empty")
    }

    func testRedeemedTokenRejected() {
        let res = TokenVerifier.verify(rawToken: "TOKEN-ALREADY-USED-9988", redeemedTokenCache: redeemedSet)
        XCTAssertFalse(res.isValid)
        XCTAssertTrue(res.failureReason?.contains("already been redeemed") ?? false)
    }

    func testShortSignatureRejected() {
        let res = TokenVerifier.verify(rawToken: "too-short", redeemedTokenCache: redeemedSet)
        XCTAssertFalse(res.isValid)
        XCTAssertTrue(res.failureReason?.contains("minimum 16 bytes required") ?? false)
    }

    func testValidTokenAccepted() {
        let valid = "ED25519-SIG-COVEN-NONCE-112233"
        let res = TokenVerifier.verify(rawToken: valid, redeemedTokenCache: redeemedSet)
        XCTAssertTrue(res.isValid)
        XCTAssertEqual(res.tokenId, valid)
    }
}
