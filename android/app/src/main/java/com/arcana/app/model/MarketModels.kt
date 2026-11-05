package com.arcana.app.model

import java.util.UUID

enum class EthicalHarvestGrade {
    Wildcrafted,
    Organic,
    Artisanal,
    EthicallySourced
}

data class MarketItem(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val botanicalName: String? = null,
    val category: PantryCategory,
    val unitPrice: Double,
    val currency: String = "USD",
    val unit: String,
    val packageSize: Double,
    val inStock: Boolean = true,
    val supplierName: String,
    val provenance: String,
    val ethicalHarvestGrade: EthicalHarvestGrade = EthicalHarvestGrade.Wildcrafted,
    val description: String
)

data class MarketOrder(
    val id: String = UUID.randomUUID().toString(),
    val items: List<MarketItem>,
    val totalAmount: Double,
    val status: String = "Delivered",
    val createdAt: String
)
