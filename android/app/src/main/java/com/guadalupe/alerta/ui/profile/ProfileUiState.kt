package com.guadalupe.alerta.ui.profile

import com.guadalupe.alerta.data.model.CitizenProfile

data class ProfileUiState(
    val dni: String = "",
    val fullName: String = "",
    val ageString: String = "",
    val phone: String = "",
    val serverIp: String = "192.168.18.167:4000",
    val dniError: String? = null,
    val nameError: String? = null,
    val ageError: String? = null,
    val phoneError: String? = null,
    val isSaving: Boolean = false,
    val isRegistered: Boolean = false,
    val initialProfile: CitizenProfile? = null
) {
    val isFormValid: Boolean
        get() {
            val dniValid = dni.trim().length == 8 && dni.all { it.isDigit() }
            val nameValid = fullName.trim().length >= 3
            val age = ageString.toIntOrNull() ?: 0
            val ageValid = age in 14..120
            val phoneClean = phone.trim().replace(" ", "").replace("+", "")
            val phoneValid = phoneClean.length >= 9
            return dniValid && nameValid && ageValid && phoneValid
        }
}
