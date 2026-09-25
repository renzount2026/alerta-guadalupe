package com.guadalupe.alerta.data.model

import com.google.gson.annotations.SerializedName

/**
 * Representa los datos del ciudadano que reporta la incidencia.
 * Se guardan de forma obligatoria en el primer arranque de la app en DataStore.
 */
data class CitizenProfile(
    @SerializedName("dni")
    val dni: String = "",

    @SerializedName("fullName")
    val fullName: String = "",

    @SerializedName("age")
    val age: Int = 0,

    @SerializedName("phone")
    val phone: String = ""
) {
    /**
     * Valida que los campos obligatorios cumplan con los estándares requeridos en Perú:
     * - DNI de 8 dígitos numéricos
     * - Nombre completo no vacío (mínimo 3 caracteres)
     * - Edad mayor o igual a 14 años
     * - Teléfono de contacto de al menos 9 dígitos
     */
    fun isValid(): Boolean {
        val dniValid = dni.trim().length == 8 && dni.all { it.isDigit() }
        val nameValid = fullName.trim().length >= 3
        val ageValid = age in 14..120
        val phoneValid = phone.trim().replace(" ", "").replace("+", "").length >= 9
        return dniValid && nameValid && ageValid && phoneValid
    }
}
