import Foundation

public enum LunarPhaseName: String, CaseIterable {
    case newMoon = "New Moon"
    case waxingCrescent = "Waxing Crescent"
    case firstQuarter = "First Quarter"
    case waxingGibbous = "Waxing Gibbous"
    case fullMoon = "Full Moon"
    case waningGibbous = "Waning Gibbous"
    case lastQuarter = "Last Quarter"
    case waningCrescent = "Waning Crescent"

    public var glyph: String {
        switch self {
        case .newMoon: return "🌑"
        case .waxingCrescent: return "🌒"
        case .firstQuarter: return "🌓"
        case .waxingGibbous: return "🌔"
        case .fullMoon: return "🌕"
        case .waningGibbous: return "🌖"
        case .lastQuarter: return "🌗"
        case .waningCrescent: return "🌘"
        }
    }
}

public struct LunarEvaluation {
    public let phase: LunarPhaseName
    public let illuminationPercent: Int
    public let ageDays: Double
}

public struct LunarCalculator {
    private static let refNewMoonEpochSeconds: Double = 1704974220 // 2024-01-11 11:57:00 UTC
    private static let synodicMonthDays: Double = 29.53058867
    private static let secondsPerDay: Double = 86400.0

    public static func calculate(date: Date = Date()) -> LunarEvaluation {
        let diffDays = (date.timeIntervalSince1970 - refNewMoonEpochSeconds) / secondsPerDay
        let normalizedAge = diffDays.truncatingRemainder(dividingBy: synodicMonthDays)
        let positiveAge = normalizedAge < 0 ? normalizedAge + synodicMonthDays : normalizedAge

        let illumination = Int(0.5 * (1.0 - cos((2.0 * .pi * positiveAge) / synodicMonthDays)) * 100.0)

        let phase: LunarPhaseName
        switch positiveAge {
        case ..<1.84566: phase = .newMoon
        case ..<5.53699: phase = .waxingCrescent
        case ..<9.22831: phase = .firstQuarter
        case ..<12.91963: phase = .waxingGibbous
        case ..<16.61096: phase = .fullMoon
        case ..<20.30228: phase = .waningGibbous
        case ..<23.99361: phase = .lastQuarter
        case ..<27.68493: phase = .waningCrescent
        default: phase = .newMoon
        }

        return LunarEvaluation(
            phase = phase,
            illuminationPercent: illumination,
            ageDays: round(positiveAge * 10.0) / 10.0
        )
    }
}
