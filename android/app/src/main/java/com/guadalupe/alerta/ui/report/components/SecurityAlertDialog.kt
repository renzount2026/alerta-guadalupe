package com.guadalupe.alerta.ui.report.components

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalPolice
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.guadalupe.alerta.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SecurityAlertDialog(
    onDismiss: () -> Unit,
    onSubmit: (subType: String, description: String, mediaUri: Uri?, mediaType: String?) -> Unit
) {
    val suggestions = listOf("Gresca", "Asalto mano armada", "Vandalismo", "Robo", "Otras faltas")
    var selectedSubType by remember { mutableStateOf(suggestions[0]) }
    var description by remember { mutableStateOf("") }
    var mediaUri by remember { mutableStateOf<Uri?>(null) }
    var mediaType by remember { mutableStateOf<String?>(null) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            modifier = Modifier
                .fillMaxWidth()
                .padding(4.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .fillMaxWidth()
            ) {
                // Header
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .background(SecurityBlue.copy(alpha = 0.2f), shape = RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocalPolice,
                            contentDescription = null,
                            tint = BlueAccent,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Alerta Seguridad",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = TextPrimary
                        )
                        Text(
                            text = "Seleccione el tipo de delito o falta",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Quick Chips
                Text(
                    text = "Sugerencias Rápidas:",
                    style = MaterialTheme.typography.labelMedium.copy(color = TextSecondary)
                )
                Spacer(modifier = Modifier.height(8.dp))

                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(suggestions) { item ->
                        val isSelected = selectedSubType == item
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) SecurityBlue else Navy800)
                                .border(
                                    width = 1.dp,
                                    color = if (isSelected) CyanAccent else Navy700,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedSubType = item }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = item,
                                color = if (isSelected) Color.White else TextSecondary,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Description Box
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Detalle del suceso...") },
                    placeholder = { Text("Ej: Dos sospechosos armados a bordo de moto lineal...") },
                    minLines = 3,
                    maxLines = 5,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyanAccent,
                        unfocusedBorderColor = Navy700
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Optional Media
                MediaAttachmentBox(
                    mediaUri = mediaUri,
                    mediaType = mediaType,
                    onMediaSelected = { uri, type ->
                        mediaUri = uri
                        mediaType = type
                    },
                    onRemoveMedia = {
                        mediaUri = null
                        mediaType = null
                    }
                )

                Spacer(modifier = Modifier.height(18.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    TextButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.textButtonColors(contentColor = TextSecondary)
                    ) {
                        Text("Cancelar")
                    }

                    Button(
                        onClick = {
                            onSubmit(
                                selectedSubType,
                                description.ifBlank { "Reporte de $selectedSubType en curso" },
                                mediaUri,
                                mediaType
                            )
                        },
                        modifier = Modifier.weight(1.5f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SecurityBlue)
                    ) {
                        Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Emitir Alerta", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
