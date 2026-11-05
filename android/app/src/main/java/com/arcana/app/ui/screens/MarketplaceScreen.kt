package com.arcana.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.arcana.app.model.MarketItem
import com.arcana.app.model.PantryItem
import com.arcana.app.ui.theme.*

@Composable
fun MarketplaceScreen(
    marketItems: List<MarketItem>,
    pantryItems: List<PantryItem>,
    onRestockItem: (MarketItem) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Obsidian900)
            .padding(16.dp)
    ) {
        Text(
            text = "Apothecary Marketplace",
            fontSize = 20.sp,
            color = Gold400,
            style = MaterialTheme.typography.titleLarge
        )
        Text(
            text = "Ethically gathered botanicals & mineral supplies",
            fontSize = 11.sp,
            color = Vellum200.copy(alpha = 0.7f)
        )

        Spacer(modifier = Modifier.height(14.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(marketItems, key = { it.id }) { item ->
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
                                text = item.name,
                                fontSize = 14.sp,
                                color = Vellum100
                            )
                            Text(
                                text = "$${"%.2f".format(item.unitPrice)}",
                                fontSize = 14.sp,
                                color = Gold400
                            )
                        }

                        Text(
                            text = "${item.provenance} • ${item.ethicalHarvestGrade.name}",
                            fontSize = 10.sp,
                            color = Sage400,
                            modifier = Modifier.padding(vertical = 2.dp)
                        )

                        Text(
                            text = item.description,
                            fontSize = 11.sp,
                            color = Vellum200.copy(alpha = 0.8f),
                            modifier = Modifier.padding(vertical = 4.dp)
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Button(
                            onClick = { onRestockItem(item) },
                            colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                            modifier = Modifier.align(Alignment.End)
                        ) {
                            Icon(Icons.Default.Bolt, contentDescription = null, tint = Obsidian950)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                "Instant Restock (+${item.packageSize.toInt()}${item.unit})",
                                color = Obsidian950,
                                fontSize = 11.sp
                            )
                        }
                    }
                }
            }
        }
    }
}
