package com.arcana.app

import com.arcana.app.domain.TokenVerifier
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class TokenVerifierTest {

    private val redeemedCache = setOf("TOKEN-EXPIRED-NONCE-1122")

    @Test
    fun testEmptyTokenRejected() {
        val res = TokenVerifier.verify("   ", redeemedCache)
        assertFalse(res.isValid)
        assertEquals("Token cannot be empty", res.failureReason)
    }

    @Test
    fun testRedeemedTokenRejected() {
        val res = TokenVerifier.verify("TOKEN-EXPIRED-NONCE-1122", redeemedCache)
        assertFalse(res.isValid)
        assertTrue(res.failureReason!!.contains("already been redeemed"))
    }

    @Test
    fun testShortSignatureRejected() {
        val res = TokenVerifier.verify("short-sig", redeemedCache)
        assertFalse(res.isValid)
        assertTrue(res.failureReason!!.contains("minimum 16 bytes required"))
    }

    @Test
    fun testValidEd25519TokenAccepted() {
        val validToken = "ED25519-SIG-COVEN-NONCE-9941-VALID"
        val res = TokenVerifier.verify(validToken, redeemedCache)
        assertTrue(res.isValid)
        assertEquals(validToken, res.tokenId)
    }
}
