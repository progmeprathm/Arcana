package com.arcana.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = Gold500,
    onPrimary = Obsidian950,
    secondary = Sage500,
    onSecondary = Vellum100,
    background = Obsidian900,
    onBackground = Vellum100,
    surface = Obsidian800,
    onSurface = Vellum100,
    surfaceVariant = Obsidian700,
    onSurfaceVariant = Vellum200,
    error = PanicRed
)

@Composable
fun ArcanaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
