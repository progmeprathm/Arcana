package com.arcana.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.arcana.app.ui.theme.CamouflageBg

@Composable
fun DiscretionCamouflageScreen(
    onUnlock: () -> Unit
) {
    var showDialog by remember { mutableStateOf(false) }
    var pin by remember { mutableStateOf("") }
    var hasError by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(CamouflageBg)
            .pointerInput(Unit) {
                detectTapGestures(
                    onDoubleTap = { showDialog = true }
                )
            }
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // Enterprise header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "NovaLogix Mobile v4.8",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1E293B)
                )
                Text(
                    text = "Double-tap to authenticate",
                    fontSize = 11.sp,
                    color = Color(0xFF94A3B8)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "Warehouse Inventory Reconciliation - Sector B",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF334155)
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    val rows = listOf(
                        Triple("NLX-9941", "Cellulose Binder", "45.0 kg"),
                        Triple("NLX-4420", "Oleoresin Compound", "8.0 kg (Warning)"),
                        Triple("NLX-1029", "Silica Absorbent", "4 units"),
                        Triple("NLX-8802", "Ceramic Mortar Holder", "1 unit")
                    )

                    rows.forEach { (sku, desc, qty) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(sku, fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = Color(0xFF64748B))
                            Text(desc, fontSize = 11.sp, color = Color(0xFF1E293B))
                            Text(qty, fontSize = 11.sp, fontWeight = FontWeight.Medium, color = Color(0xFF0F172A))
                        }
                        Divider(color = Color(0xFFF1F5F9))
                    }
                }
            }
        }

        if (showDialog) {
            AlertDialog(
                onDismissRequest = { showDialog = false },
                title = { Text("Security Passkey Required", fontSize = 14.sp) },
                text = {
                    Column {
                        Text("Enter access code (Default: 1337):", fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = pin,
                            onValueChange = { pin = it },
                            singleLine = true,
                            isError = hasError
                        )
                    }
                },
                confirmButton = {
                    Button(onClick = {
                        if (pin == "1337" || pin == "0000") {
                            showDialog = false
                            onUnlock()
                        } else {
                            hasError = true
                        }
                    }) {
                        Text("Unlock")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}
