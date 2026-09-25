package com.guadalupe.alerta.ui.report

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.guadalupe.alerta.data.datastore.ProfileDataStore
import com.guadalupe.alerta.data.location.LocationService
import com.guadalupe.alerta.data.model.AlertReport
import com.guadalupe.alerta.data.model.CitizenProfile
import com.guadalupe.alerta.data.model.LocationReport
import com.guadalupe.alerta.data.model.currentIsoTimestamp
import com.guadalupe.alerta.data.repository.AlertRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.UUID

data class ReportUiState(
    val citizenProfile: CitizenProfile? = null,
    val isSubmitting: Boolean = false,
    val lastSubmittedAlert: AlertReport? = null,
    val successMessage: String? = null,
    val errorMessage: String? = null,
    val activeDialog: ActiveDialogType? = null,
    val serverIp: String = ProfileDataStore.DEFAULT_SERVER_IP
)

enum class ActiveDialogType {
    SECURITY,
    SUSPICIOUS,
    EMERGENCY
}

class ReportViewModel(
    private val dataStore: ProfileDataStore,
    private val locationService: LocationService,
    private val alertRepository: AlertRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ReportUiState())
    val uiState: StateFlow<ReportUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            dataStore.citizenProfileFlow.collect { profile ->
                _uiState.update { it.copy(citizenProfile = profile) }
            }
        }
        viewModelScope.launch {
            dataStore.serverIpFlow.collect { ip ->
                _uiState.update { it.copy(serverIp = ip) }
            }
        }
    }

    fun updateServerIp(newIp: String) {
        viewModelScope.launch {
            dataStore.saveServerIp(newIp)
        }
    }

    fun openDialog(type: ActiveDialogType) {
        _uiState.update { it.copy(activeDialog = type) }
    }

    fun closeDialog() {
        _uiState.update { it.copy(activeDialog = null) }
    }

    fun clearFeedback() {
        _uiState.update { it.copy(successMessage = null, errorMessage = null) }
    }

    fun submitAlert(
        alertType: String,
        subType: String,
        description: String,
        mediaUri: Uri?,
        mediaType: String?
    ) {
        val currentCitizen = _uiState.value.citizenProfile ?: run {
            _uiState.update { it.copy(errorMessage = "Debe completar su registro antes de reportar") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSubmitting = true, activeDialog = null) }

            // 1. Obtener ubicación instantánea vía Google Play Services Fused Location
            val location: LocationReport = locationService.getCurrentLocation()

            // 2. Mock de URL multimedia para demostración si se adjuntó archivo local
            val mediaUrl = if (mediaUri != null) {
                if (mediaType == "IMAGE") {
                    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"
                } else {
                    "https://www.w3schools.com/html/mov_bbb.mp4"
                }
            } else null

            // 3. Estructurar payload exacto requerido
            val alertReport = AlertReport(
                id = "RPT-2026-" + UUID.randomUUID().toString().take(6).uppercase(),
                citizen = currentCitizen,
                alertType = alertType,
                subType = subType,
                description = description,
                location = location,
                mediaUrl = mediaUrl,
                mediaType = mediaType,
                createdAt = currentIsoTimestamp(),
                status = "REGISTRADO"
            )

            // 4. Enviar mediante AlertRepository
            val result = alertRepository.sendAlert(alertReport)
            result.onSuccess { sent ->
                _uiState.update {
                    it.copy(
                        isSubmitting = false,
                        lastSubmittedAlert = sent,
                        successMessage = "¡Alerta '${sent.subType}' transmitida con éxito a Serenazgo Guadalupe!"
                    )
                }
            }.onFailure { err ->
                _uiState.update {
                    it.copy(
                        isSubmitting = false,
                        errorMessage = "Error al conectar: ${err.localizedMessage ?: "Reintente en breve"}"
                    )
                }
            }
        }
    }
}

class ReportViewModelFactory(
    private val dataStore: ProfileDataStore,
    private val locationService: LocationService,
    private val alertRepository: AlertRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return ReportViewModel(dataStore, locationService, alertRepository) as T
    }
}
