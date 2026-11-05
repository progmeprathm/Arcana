package com.arcana.app.model

import java.util.UUID

enum class PantryCategory {
    Flora,
    Fauna,
    Mineral,
    Tool
}

data class PantryItem(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val name: String,
    val category: PantryCategory,
    val quantity: Double,
    val unit: String,
    val harvestDate: String? = null,
    val lunarPhase: String? = null,
    val minThreshold: Double = 0.0,
    val shelfLifeDays: Int? = null,
    val notes: String = ""
) {
    val isLowStock: Boolean
        get() = quantity <= minThreshold
}
