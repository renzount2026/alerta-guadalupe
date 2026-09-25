package com.guadalupe.alerta.ui.report

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guadalupe.alerta.ui.report.components.EmergencyAlertDialog
import com.guadalupe.alerta.ui.report.components.SecurityAlertDialog
import com.guadalupe.alerta.ui.report.components.SuspiciousAlertDialog
import com.guadalupe.alerta.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportDashboardScreen(
    viewModel: ReportViewModel,
    onNavigateToProfile: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    var showServerSettings by remember { mutableStateOf(false) }

    if (showServerSettings) {
        var tempIp by remember { mutableStateOf(state.serverIp) }
        AlertDialog(
            onDismissRequest = { showServerSettings = false },
            containerColor = CardDark,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Settings, contentDescription = null, tint = CyanAccent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        "Configurar Servidor Central",
                        color = TextPrimary,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "Modifica la IP o URL del backend para enviar tus alertas en tiempo real:",
                        color = TextSecondary,
                        fontSize = 13.sp
                    )
                    OutlinedTextField(
                        value = tempIp,
                        onValueChange = { tempIp = it },
                        label = { Text("IP / Host") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanAccent,
                            unfocusedBorderColor = Navy700
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Text("Accesos directos:", color = TextSecondary, fontSize = 12.sp)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SuggestionChip(
                            onClick = { tempIp = "192.168.18.167:4000" },
                            label = { Text("Wi-Fi PC", fontSize = 11.sp) }
                        )
                        SuggestionChip(
                            onClick = { tempIp = "10.0.2.2:4000" },
                            label = { Text("Emulador", fontSize = 11.sp) }
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.updateServerIp(tempIp)
                        showServerSettings = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent)
                ) {
                    Text("Guardar IP", color = Navy900, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showServerSettings = false }) {
                    Text("Cancelar", color = TextSecondary)
                }
            }
        )
    }

    // Manejo de diálogos según el estado UDF
    when (state.activeDialog) {
        ActiveDialogType.SECURITY -> {
            SecurityAlertDialog(
                onDismiss = { viewModel.closeDialog() },
                onSubmit = { subType, description, mediaUri, mediaType ->
                    viewModel.submitAlert(
                        alertType = "Alerta Seguridad",
                        subType = subType,
                        description = description,
                        mediaUri = mediaUri,
                        mediaType = mediaType
                    )
                }
            )
        }
        ActiveDialogType.SUSPICIOUS -> {
            SuspiciousAlertDialog(
                onDismiss = { viewModel.closeDialog() },
                onSubmit = { description, mediaUri, mediaType ->
                    viewModel.submitAlert(
                        alertType = "Actitud Sospechosa",
                        subType = "Actitud Sospechosa",
                        description = description,
                        mediaUri = mediaUri,
                        mediaType = mediaType
                    )
                }
            )
        }
        ActiveDialogType.EMERGENCY -> {
            EmergencyAlertDialog(
                onDismiss = { viewModel.closeDialog() },
                onSubmit = { description, mediaUri, mediaType ->
                    viewModel.submitAlert(
                        alertType = "Emergencia",
                        subType = "Emergencia Inmediata",
                        description = description,
                        mediaUri = mediaUri,
                        mediaType = mediaType
                    )
                }
            )
        }
        null -> {}
    }

    Scaffold(
        containerColor = SurfaceDark,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .background(Navy700, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Shield,
                                contentDescription = null,
                                tint = CyanAccent,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                "Alerta Guadalupe",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                "La Libertad, Perú • Serenazgo",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { showServerSettings = true }) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = "Configurar IP Servidor",
                            tint = CyanAccent
                        )
                    }
                    IconButton(onClick = onNavigateToProfile) {
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = "Perfil Ciudadano",
                            tint = CyanAccent
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Navy900)
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Citizen Header Card
                state.citizenProfile?.let { citizen ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = CardDark),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .padding(16.dp)
                                .fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(42.dp)
                                        .background(Navy800, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Person,
                                        contentDescription = null,
                                        tint = CyanAccent
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = citizen.fullName,
                                        color = TextPrimary,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp
                                    )
                                    Text(
                                        text = "DNI: ${citizen.dni} • ${citizen.phone}",
                                        color = TextSecondary,
                                        fontSize = 12.sp
                                    )
                                }
                            }
                            Box(
                                modifier = Modifier
                                    .background(SuccessEmerald.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                                    .border(1.dp, SuccessEmerald, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "ACTIVO",
                                    color = SuccessEmerald,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black
                                )
                            }
                        }
                    }
                }

                // Banner de notificación de éxito
                AnimatedVisibility(visible = state.successMessage != null) {
                    state.successMessage?.let { msg ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = SuccessEmerald.copy(alpha = 0.2f)),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, SuccessEmerald, RoundedCornerShape(12.dp))
                                .clickable { viewModel.clearFeedback() }
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SuccessEmerald)
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(msg, color = TextPrimary, fontSize = 13.sp, modifier = Modifier.weight(1f))
                                Icon(Icons.Default.Close, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }

                Text(
                    text = "Seleccione una Acción de Reporte",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextSecondary
                )

                // BOTÓN 1: ALERTA SEGURIDAD
                ReportActionButton(
                    title = "ALERTA SEGURIDAD",
                    subtitle = "Grescas, asaltos, robos, vandalismo u otras faltas",
                    icon = Icons.Default.Security,
                    colorGradient = listOf(Color(0xFF1565C0), Color(0xFF0D47A1)),
                    accentColor = CyanAccent,
                    onClick = { viewModel.openDialog(ActiveDialogType.SECURITY) }
                )

                // BOTÓN 2: ACTITUD SOSPECHOSA
                ReportActionButton(
                    title = "ACTITUD SOSPECHOSA",
                    subtitle = "Sujetos o vehículos vigilando o merodeando zonas",
                    icon = Icons.Default.Visibility,
                    colorGradient = listOf(Color(0xFFEF6C00), Color(0xFFE65100)),
                    accentColor = SuspiciousAmberLight,
                    onClick = { viewModel.openDialog(ActiveDialogType.SUSPICIOUS) }
                )

                // BOTÓN 3: BOTÓN EMERGENCIA (ALTO IMPACTO)
                ReportActionButton(
                    title = "EMERGENCIA INMEDIATA",
                    subtitle = "Auxilio urgente, peligro inminente de vida o accidente grave",
                    icon = Icons.Default.Warning,
                    colorGradient = listOf(Color(0xFFD32F2F), Color(0xFFB71C1C)),
                    accentColor = Color(0xFFFF8A80),
                    isEmergency = true,
                    onClick = { viewModel.openDialog(ActiveDialogType.EMERGENCY) }
                )

                Spacer(modifier = Modifier.height(10.dp))

                // GPS Status Info
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = CyanAccent,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Geolocalización GPS automática activada (Guadalupe)",
                        color = TextMuted,
                        fontSize = 12.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Indicador de progreso durante el despacho
            if (state.isSubmitting) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.6f)),
                    contentAlignment = Alignment.Center
                ) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardDark),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.padding(32.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            CircularProgressIndicator(color = CyanAccent)
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                "Transmitiendo reporte a Serenazgo...",
                                color = TextPrimary,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ReportActionButton(
    title: String,
    subtitle: String,
    icon: ImageVector,
    colorGradient: List<Color>,
    accentColor: Color,
    isEmergency: Boolean = false,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(if (isEmergency) 10.dp else 4.dp, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Brush.horizontalGradient(colorGradient))
                .border(
                    width = if (isEmergency) 1.5.dp else 1.dp,
                    color = accentColor.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(16.dp)
                )
                .padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .background(Color.Black.copy(alpha = 0.25f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(30.dp)
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        fontSize = if (isEmergency) 18.sp else 16.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(3.dp))
                    Text(
                        text = subtitle,
                        fontSize = 12.sp,
                        color = Color.White.copy(alpha = 0.85f),
                        lineHeight = 16.sp
                    )
                }

                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = Color.White.copy(alpha = 0.8f),
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    }
}
