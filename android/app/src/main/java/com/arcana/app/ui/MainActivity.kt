package com.arcana.app.ui

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.arcana.app.model.*
import com.arcana.app.ui.screens.DiscretionCamouflageScreen
import com.arcana.app.ui.screens.PantryScreen
import com.arcana.app.ui.theme.ArcanaTheme
import kotlin.math.sqrt

enum class ArcanaNavTab(val title: String, val icon: ImageVector) {
    Pantry("Pantry", Icons.Default.Inventory),
    Archive("Archive", Icons.Default.AutoStories),
    Chronicle("Chronicle", Icons.Default.EditNote),
    Coven("Coven", Icons.Default.Groups),
    Sanctum("Sanctum", Icons.Default.Shield)
}

class MainActivity : ComponentActivity(), SensorEventListener {

    private var sensorManager: SensorManager? = null
    private var isPanicTriggered by mutableStateOf(false)
    private var lastAcceleration = 0f
    private var currentAcceleration = 0f
    private var shakeThreshold = 14f

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize accelerometer for shake discretion trigger (FR-SAN-02)
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as? SensorManager
        sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.also { accelerometer ->
            sensorManager?.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_UI)
        }

        setContent {
            ArcanaTheme {
                if (isPanicTriggered) {
                    DiscretionCamouflageScreen(
                        onUnlock = { isPanicTriggered = false }
                    )
                } else {
                    ArcanaAppScaffold(
                        onTriggerPanic = { isPanicTriggered = true }
                    )
                }
            }
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return
        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]

        lastAcceleration = currentAcceleration
        currentAcceleration = sqrt((x * x + y * y + z * z).toDouble()).toFloat()
        val delta = currentAcceleration - lastAcceleration

        if (delta > shakeThreshold) {
            // Rapid shake detected: immediately trigger disguise
            isPanicTriggered = true
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onDestroy() {
        super.onDestroy()
        sensorManager?.unregisterListener(this)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ArcanaAppScaffold(
    onTriggerPanic: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(ArcanaNavTab.Pantry) }

    // Seed mock data
    val pantryItems = remember {
        mutableStateListOf(
            PantryItem(
                userId = "rowan",
                name = "Mugwort (Artemisia vulgaris)",
                category = PantryCategory.Flora,
                quantity = 45.0,
                unit = "g",
                minThreshold = 15.0,
                lunarPhase = "Waxing Gibbous",
                notes = "Wild gathered under Waxing Gibbous"
            ),
            PantryItem(
                userId = "rowan",
                name = "Frankincense Resin Tears",
                category = PantryCategory.Flora,
                quantity = 8.0,
                unit = "g",
                minThreshold = 10.0,
                notes = "Low stock alert triggered"
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("ARCANA", style = MaterialTheme.typography.titleMedium) },
                actions = {
                    IconButton(onClick = onTriggerPanic) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = "Panic Camouflage"
                        )
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                ArcanaNavTab.values().forEach { tab ->
                    NavigationBarItem(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        icon = { Icon(tab.icon, contentDescription = tab.title) },
                        label = { Text(tab.title) }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedTab) {
                ArcanaNavTab.Pantry -> PantryScreen(
                    items = pantryItems,
                    onAddItem = { pantryItems.add(0, it) }
                )
                else -> {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "${selectedTab.title} Module Active",
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = "Native Android module conforming to PRD v1.0.0 architecture.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }
    }
}
