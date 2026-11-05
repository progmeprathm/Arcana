package com.arcana.app

import com.arcana.app.domain.LunarCalculator
import com.arcana.app.domain.LunarPhase
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class LunarCalculatorTest {

    @Test
    fun testReferenceNewMoonEpoch() {
        val result = LunarCalculator.calculate(1704974220000L) // 2024-01-11 11:57:00 UTC
        assertEquals(LunarPhase.NewMoon, result.phase)
        assertEquals(0, result.illuminationPercent)
    }

    @Test
    fun testCalculatedIlluminationBounds() {
        val current = LunarCalculator.calculate()
        assertTrue("Illumination >= 0", current.illuminationPercent >= 0)
        assertTrue("Illumination <= 100", current.illuminationPercent <= 100)
    }

    @Test
    fun testPhaseGlyphsNonEmpty() {
        LunarPhase.values().forEach { phase ->
            assertTrue(phase.glyph.isNotEmpty())
            assertTrue(phase.displayName.isNotEmpty())
        }
    }
}
