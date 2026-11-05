import XCTest
@testable import Arcana

final class LunarCalculatorTests: XCTestCase {

    func testReferenceNewMoonEpoch() {
        let refDate = Date(timeIntervalSince1970: 1704974220) // 2024-01-11 11:57:00 UTC
        let eval = LunarCalculator.calculate(date: refDate)
        XCTAssertEqual(eval.phase, .newMoon)
        XCTAssertEqual(eval.illuminationPercent, 0)
    }

    func testIlluminationBounds() {
        let eval = LunarCalculator.calculate()
        XCTAssertGreaterThanOrEqual(eval.illuminationPercent, 0)
        XCTAssertLessThanOrEqual(eval.illuminationPercent, 100)
    }

    func testGlyphsDefined() {
        for phase in LunarPhaseName.allCases {
            XCTAssertFalse(phase.glyph.isEmpty)
        }
    }
}
