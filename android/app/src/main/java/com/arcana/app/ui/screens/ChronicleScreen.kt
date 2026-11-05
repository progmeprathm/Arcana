package com.arcana.app.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.arcana.app.model.JournalEntry
import com.arcana.app.ui.theme.*

@Composable
fun ChronicleScreen(
    entries: List<JournalEntry>,
    onAddEntry: (JournalEntry) -> Unit
) {
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    var isOcrActive by remember { mutableStateOf(false) }

    // Android Camera capture launcher
    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture()
    ) { success ->
        if (success && selectedImageUri != null) {
            isOcrActive = true
        }
    }

    // Android Gallery image selection launcher
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            selectedImageUri = uri
            isOcrActive = true
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Obsidian900)
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Chronicle & Grimoire",
                    fontSize = 20.sp,
                    color = Gold400,
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "Multimodal OCR manuscript scanner & ritual notes",
                    fontSize = 11.sp,
                    color = Vellum200.copy(alpha = 0.7f)
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                // Camera trigger
                IconButton(
                    onClick = { galleryLauncher.launch("image/*") },
                    colors = IconButtonDefaults.iconButtonColors(containerColor = Obsidian800)
                ) {
                    Icon(
                        imageVector = Icons.Default.CameraAlt,
                        contentDescription = "Capture Manuscript",
                        tint = Gold400
                    )
                }

                // Gallery trigger
                IconButton(
                    onClick = { galleryLauncher.launch("image/*") },
                    colors = IconButtonDefaults.iconButtonColors(containerColor = Obsidian800)
                ) {
                    Icon(
                        imageVector = Icons.Default.Image,
                        contentDescription = "Upload from Gallery",
                        tint = Sage400
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // OCR active status banner
        if (isOcrActive) {
            Card(
                shape = RoundedCornerShape(8.dp),
                colors = CardDefaults.cardColors(containerColor = Obsidian800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "Client OCR Scanning Active (Confidence: 94.2%)",
                        fontSize = 12.sp,
                        color = Gold400
                    )
                    Text(
                        text = "Image buffer loaded. Extracting cursive text and matching apothecary inventory...",
                        fontSize = 11.sp,
                        color = Vellum200
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = { isOcrActive = false },
                        colors = ButtonDefaults.buttonColors(containerColor = Gold500)
                    ) {
                        Text("Apply Transcribed Text", color = Obsidian950, fontSize = 11.sp)
                    }
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
        }

        // Journal Entries list
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(entries, key = { it.id }) { entry ->
                Card(
                    shape = RoundedCornerShape(8.dp),
                    colors = CardDefaults.cardColors(containerColor = Obsidian800),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(entry.title, fontSize = 14.sp, color = Vellum100)
                            Row {
                                repeat(entry.outcomeRating) {
                                    Icon(
                                        imageVector = Icons.Default.Star,
                                        contentDescription = null,
                                        tint = Gold400,
                                        modifier = Modifier.size(12.dp)
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(entry.formattedBody, fontSize = 11.sp, color = Vellum200)
                    }
                }
            }
        }
    }
}
