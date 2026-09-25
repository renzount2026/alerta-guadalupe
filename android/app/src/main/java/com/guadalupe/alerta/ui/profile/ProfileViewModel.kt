package com.guadalupe.alerta.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.guadalupe.alerta.data.datastore.ProfileDataStore
import com.guadalupe.alerta.data.model.CitizenProfile
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class ProfileViewModel(
    private val dataStore: ProfileDataStore
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState())
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            dataStore.citizenProfileFlow.collect { savedProfile ->
                if (savedProfile != null && savedProfile.isValid()) {
                    _uiState.update {
                        it.copy(
                            dni = savedProfile.dni,
                            fullName = savedProfile.fullName,
                            ageString = savedProfile.age.toString(),
                            phone = savedProfile.phone,
                            isRegistered = true,
                            initialProfile = savedProfile
                        )
                    }
                }
            }
        }
        viewModelScope.launch {
            dataStore.serverIpFlow.collect { savedIp ->
                _uiState.update { it.copy(serverIp = savedIp) }
            }
        }
    }

    fun onDniChanged(newDni: String) {
        val filtered = newDni.filter { it.isDigit() }.take(8)
        val error = if (filtered.isNotEmpty() && filtered.length < 8) "El DNI debe tener 8 dígitos" else null
        _uiState.update { it.copy(dni = filtered, dniError = error) }
    }

    fun onFullNameChanged(newName: String) {
        val error = if (newName.trim().isNotEmpty() && newName.trim().length < 3) "Ingrese nombre y apellido completo" else null
        _uiState.update { it.copy(fullName = newName, nameError = error) }
    }

    fun onAgeChanged(newAge: String) {
        val filtered = newAge.filter { it.isDigit() }.take(3)
        val ageInt = filtered.toIntOrNull()
        val error = if (ageInt != null && ageInt !in 14..120) "Edad debe ser entre 14 y 120" else null
        _uiState.update { it.copy(ageString = filtered, ageError = error) }
    }

    fun onPhoneChanged(newPhone: String) {
        val filtered = newPhone.take(15)
        val clean = filtered.replace(" ", "").replace("+", "")
        val error = if (clean.isNotEmpty() && clean.length < 9) "Mínimo 9 dígitos" else null
        _uiState.update { it.copy(phone = filtered, phoneError = error) }
    }

    fun onServerIpChanged(newIp: String) {
        _uiState.update { it.copy(serverIp = newIp) }
    }

    fun saveProfile(onSuccess: () -> Unit) {
        val state = _uiState.value
        if (!state.isFormValid) return

        val profile = CitizenProfile(
            dni = state.dni.trim(),
            fullName = state.fullName.trim(),
            age = state.ageString.toInt(),
            phone = state.phone.trim()
        )

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true) }
            dataStore.saveProfile(profile)
            if (state.serverIp.isNotBlank()) {
                dataStore.saveServerIp(state.serverIp)
            }
            _uiState.update { it.copy(isSaving = false, isRegistered = true, initialProfile = profile) }
            onSuccess()
        }
    }
}

class ProfileViewModelFactory(
    private val dataStore: ProfileDataStore
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return ProfileViewModel(dataStore) as T
    }
}
