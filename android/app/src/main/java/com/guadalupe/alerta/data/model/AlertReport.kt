package com.guadalupe.alerta.data.model

import com.google.gson.annotations.SerializedName
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

/**
 * Modelo exacto del Payload JSON para el reporte de incidentes y seguridad vecinal.
 */
data class AlertReport(
    @SerializedName("id")
    val id: String,

    @SerializedName("citizen")
    val citizen: CitizenProfile,

    @SerializedName("alertType")
    val alertType: String, // "Alerta Seguridad" | "Actitud Sospechosa" | "Emergencia"

    @SerializedName("subType")
    val subType: String, // "Gresca", "Asalto mano armada", "Vandalismo", "Robo", "Otras faltas", etc.

    @SerializedName("description")
    val description: String,

    @SerializedName("location")
    val location: LocationReport,

    @SerializedName("mediaUrl")
    val mediaUrl: String? = null,

    @SerializedName("mediaType")
    val mediaType: String? = null, // "IMAGE" | "VIDEO" | null

    @SerializedName("createdAt")
    val createdAt: String = currentIsoTimestamp(),

    @SerializedName("status")
    val status: String = "REGISTRADO"
)

data class LocationReport(
    @SerializedName("lat")
    val lat: Double,

    @SerializedName("lng")
    val lng: Double,

    @SerializedName("addressReference")
    val addressReference: String = "Guadalupe, La Libertad, Perú"
)

enum class AlertTypeCategory(val displayName: String) {
    SEGURIDAD("Alerta Seguridad"),
    SOSPECHOSA("Actitud Sospechosa"),
    EMERGENCIA("Emergencia")
}

fun currentIsoTimestamp(): String {
    val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
    sdf.timeZone = TimeZone.getTimeZone("UTC")
    return sdf.format(Date())
}
