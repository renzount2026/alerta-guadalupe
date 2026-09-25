package com.guadalupe.alerta.data.location

import android.annotation.SuppressLint
import android.content.Context
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.guadalupe.alerta.data.model.LocationReport
import kotlinx.coroutines.tasks.await

class LocationService(private val context: Context) {

    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    // Coordenadas predeterminadas de Guadalupe (Plaza de Armas)
    private val defaultGuadalupeLat = -7.2435
    private val defaultGuadalupeLng = -79.4705

    @SuppressLint("MissingPermission")
    suspend fun getCurrentLocation(): LocationReport {
        return try {
            val location = fusedLocationClient.getCurrentLocation(
                Priority.PRIORITY_HIGH_ACCURACY,
                null
            ).await()

            if (location != null) {
                LocationReport(
                    lat = location.latitude,
                    lng = location.longitude,
                    addressReference = "Ubicación detectada por GPS (Guadalupe)"
                )
            } else {
                // Fallback última conocida o centro de Guadalupe
                val lastKnown = fusedLocationClient.lastLocation.await()
                if (lastKnown != null) {
                    LocationReport(
                        lat = lastKnown.latitude,
                        lng = lastKnown.longitude,
                        addressReference = "Última ubicación conocida (Guadalupe)"
                    )
                } else {
                    LocationReport(
                        lat = defaultGuadalupeLat,
                        lng = defaultGuadalupeLng,
                        addressReference = "Centro Urbano Guadalupe, La Libertad"
                    )
                }
            }
        } catch (e: Exception) {
            // Si el permiso no está otorgado o GPS apagado, reporta con coordenadas referenciales de Guadalupe
            LocationReport(
                lat = defaultGuadalupeLat,
                lng = defaultGuadalupeLng,
                addressReference = "Guadalupe (Referencia estimada)"
            )
        }
    }
}
