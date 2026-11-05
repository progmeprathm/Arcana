package com.arcana.app.domain

import java.time.Instant
import kotlin.math.cos

enum class LunarPhase(val displayName: String, val glyph: String) {
    NewMoon("New Moon", "🌑"),
    WaxingCrescent("Waxing Crescent", "🌒"),
    FirstQuarter("First Quarter", "🌓"),
    WaxingGibbous("Waxing Gibbous", "🌔"),
    FullMoon("Full Moon", "🌕"),
    WaningGibbous("Waning Gibbous", "🌖"),
    LastQuarter("Last Quarter", "🌗"),
    WaningCrescent("Waning Crescent", "🌘")
}

data class LunarEvaluation(
    val phase: LunarPhase,
    val illuminationPercent: Int,
    val ageDays: Double
)

object LunarCalculator {
    private const val REF_NEW_MOON_EPOCH_MS = 1704974220000L // 2024-01-11 11:57:00 UTC
    private const val SYNODIC_MONTH_DAYS = 29.53058867
    private const val MS_PER_DAY = 86400000.0

    fun calculate(epochMs: Long = Instant.now().toEpochMilli()): LunarEvaluation {
        val diffDays = (epochMs - REF_NEW_MOON_EPOCH_MS) / MS_PER_DAY
        val normalizedAge = ((diffDays % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS
        val illumination = (0.5 * (1.0 - cos((2.0 * Math.PI * normalizedAge) / SYNODIC_MONTH_DAYS)) * 100.0).toInt()

        val phase = when {
            normalizedAge < 1.84566 -> LunarPhase.NewMoon
            normalizedAge < 5.53699 -> LunarPhase.WaxingCrescent
            normalizedAge < 9.22831 -> LunarPhase.FirstQuarter
            normalizedAge < 12.91963 -> LunarPhase.WaxingGibbous
            normalizedAge < 16.61096 -> LunarPhase.FullMoon
            normalizedAge < 20.30228 -> LunarPhase.WaningGibbous
            normalizedAge < 23.99361 -> LunarPhase.LastQuarter
            normalizedAge < 27.68493 -> LunarPhase.WaningCrescent
            else -> LunarPhase.NewMoon
        }

        return LunarEvaluation(
            phase = phase,
            illuminationPercent = illumination,
            ageDays = Math.round(normalizedAge * 10.0) / 10.0
        )
    }
}
