package com.guadalupe.alerta.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Cake
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guadalupe.alerta.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel,
    onProfileConfigured: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Navy900, SurfaceDark)
                )
            )
            .padding(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Header Icon & Title
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .background(Navy700, shape = RoundedCornerShape(20.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = "Logo Seguridad",
                    tint = CyanAccent,
                    modifier = Modifier.size(44.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Seguridad Vecinal Guadalupe",
                style = MaterialTheme.typography.headlineSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                ),
                textAlign = TextAlign.Center
            )

            Text(
                text = "Registro obligatorio del ciudadano para envío de alertas y socorro inmediato.",
                style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Card Form
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardDark)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // DNI Field
                    OutlinedTextField(
                        value = state.dni,
                        onValueChange = { viewModel.onDniChanged(it) },
                        label = { Text("DNI (8 dígitos)") },
                        leadingIcon = { Icon(Icons.Default.Badge, contentDescription = null, tint = CyanAccent) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        isError = state.dniError != null,
                        supportingText = {
                            state.dniError?.let { Text(it, color = EmergencyRed) }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanAccent,
                            unfocusedBorderColor = Navy700
                        )
                    )

                    // Nombres y Apellidos
                    OutlinedTextField(
                        value = state.fullName,
                        onValueChange = { viewModel.onFullNameChanged(it) },
                        label = { Text("Nombres y Apellidos") },
                        leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = CyanAccent) },
                        singleLine = true,
                        isError = state.nameError != null,
                        supportingText = {
                            state.nameError?.let { Text(it, color = EmergencyRed) }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanAccent,
                            unfocusedBorderColor = Navy700
                        )
                    )

                    // Edad
                    OutlinedTextField(
                        value = state.ageString,
                        onValueChange = { viewModel.onAgeChanged(it) },
                        label = { Text("Edad (años)") },
                        leadingIcon = { Icon(Icons.Default.Cake, contentDescription = null, tint = CyanAccent) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        isError = state.ageError != null,
                        supportingText = {
                            state.ageError?.let { Text(it, color = EmergencyRed) }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanAccent,
                            unfocusedBorderColor = Navy700
                        )
                    )

                    // Teléfono de contacto
                    OutlinedTextField(
                        value = state.phone,
                        onValueChange = { viewModel.onPhoneChanged(it) },
                        label = { Text("Teléfono de Contacto (+51...)") },
                        leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null, tint = CyanAccent) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        singleLine = true,
                        isError = state.phoneError != null,
                        supportingText = {
                            state.phoneError?.let { Text(it, color = EmergencyRed) }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanAccent,
                            unfocusedBorderColor = Navy700
                        )
                    )

                    HorizontalDivider(
                        color = Navy700,
                        modifier = Modifier.padding(vertical = 4.dp)
                    )

                    // Configuración IP/Host Servidor
                    Text(
                        text = "Servidor Central (Vercel Cloud / Red Local)",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = CyanAccent,
                            fontWeight = FontWeight.Bold
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = state.serverIp,
                        onValueChange = { viewModel.onServerIpChanged(it) },
                        label = { Text("URL / Host del Servidor") },
                        leadingIcon = { Icon(Icons.Default.Settings, contentDescription = null, tint = CyanAccent) },
                        singleLine = true,
                        supportingText = {
                            Text("Ej: https://tu-alerta.vercel.app o 192.168.18.167:4000", color = TextSecondary, fontSize = 11.sp)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanAccent,
                            unfocusedBorderColor = Navy700
                        )
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        SuggestionChip(
                            onClick = { viewModel.onServerIpChanged("https://alerta-guadalupe.vercel.app") },
                            label = { Text("Nube (Vercel)", fontSize = 11.sp) }
                        )
                        SuggestionChip(
                            onClick = { viewModel.onServerIpChanged("192.168.18.167:4000") },
                            label = { Text("Wi-Fi Local", fontSize = 11.sp) }
                        )
                        SuggestionChip(
                            onClick = { viewModel.onServerIpChanged("10.0.2.2:4000") },
                            label = { Text("Emulador", fontSize = 11.sp) }
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Botón Guardar
                    Button(
                        onClick = {
                            viewModel.saveProfile {
                                onProfileConfigured()
                            }
                        },
                        enabled = state.isFormValid && !state.isSaving,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = BlueAccent,
                            disabledContainerColor = Navy700
                        )
                    ) {
                        if (state.isSaving) {
                            CircularProgressIndicator(
                                color = Color.White,
                                modifier = Modifier.size(24.dp)
                            )
                        } else {
                            Text(
                                text = "Completar Registro y Continuar",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}
