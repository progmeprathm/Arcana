package com.arcana.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.arcana.app.model.PantryCategory
import com.arcana.app.model.PantryItem
import com.arcana.app.ui.theme.*

@Composable
fun PantryScreen(
    items: List<PantryItem>,
    onAddItem: (PantryItem) -> Unit
) {
    var selectedCategory by remember { mutableStateOf<PantryCategory?>(null) }

    val filtered = remember(items, selectedCategory) {
        if (selectedCategory == null) items else items.filter { it.category == selectedCategory }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Obsidian900)
            .padding(16.dp)
    ) {
        // Section Header
        Text(
            text = "Pantry Reserves",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Gold400
        )
        Text(
            text = "Supplies, harvest cycles & shelf-life tracking",
            fontSize = 12.sp,
            color = Vellum200.copy(alpha = 0.7f)
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Category filter chips
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = selectedCategory == null,
                onClick = { selectedCategory = null },
                label = { Text("All", fontSize = 11.sp) }
            )
            PantryCategory.values().forEach { cat ->
                FilterChip(
                    selected = selectedCategory == cat,
                    onClick = { selectedCategory = cat },
                    label = { Text(cat.name, fontSize = 11.sp) }
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Inventory list
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filtered, key = { it.id }) { item ->
                PantryCard(item = item)
            }
        }
    }
}

@Composable
fun PantryCard(item: PantryItem) {
    Card(
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Obsidian800),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = item.category.name.uppercase(),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Sage400
                )

                if (item.isLowStock) {
                    Surface(
                        color = WarningAmber.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = "LOW STOCK",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = WarningAmber,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = item.name,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = Vellum100
            )

            if (item.notes.isNotEmpty()) {
                Text(
                    text = "\"${item.notes}\"",
                    fontSize = 11.sp,
                    color = Vellum200.copy(alpha = 0.7f),
                    modifier = Modifier.padding(vertical = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom
            ) {
                Row(verticalAlignment = Alignment.Baseline) {
                    Text(
                        text = "%.1f".format(item.quantity),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        color = Gold400
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = item.unit,
                        fontSize = 12.sp,
                        color = Vellum200.copy(alpha = 0.6f)
                    )
                }

                if (item.lunarPhase != null) {
                    Text(
                        text = "Phase: ${item.lunarPhase}",
                        fontSize = 11.sp,
                        color = Vellum200.copy(alpha = 0.8f)
                    )
                }
            }
        }
    }
}
