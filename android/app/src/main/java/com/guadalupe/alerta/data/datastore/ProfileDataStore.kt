package com.guadalupe.alerta.data.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.guadalupe.alerta.data.model.CitizenProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "guadalupe_citizen_profile")

class ProfileDataStore(private val context: Context) {

    companion object {
        val KEY_DNI = stringPreferencesKey("citizen_dni")
        val KEY_FULL_NAME = stringPreferencesKey("citizen_full_name")
        val KEY_AGE = intPreferencesKey("citizen_age")
        val KEY_PHONE = stringPreferencesKey("citizen_phone")
        val KEY_SERVER_IP = stringPreferencesKey("server_ip")
        const val DEFAULT_SERVER_IP = "192.168.18.167:4000"
    }

    /**
     * Emite la IP/Host configurada del servidor central.
     */
    val serverIpFlow: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[KEY_SERVER_IP] ?: DEFAULT_SERVER_IP
    }

    /**
     * Guarda la IP/Host del servidor central.
     */
    suspend fun saveServerIp(ip: String) {
        context.dataStore.edit { preferences ->
            preferences[KEY_SERVER_IP] = ip.trim()
        }
    }

    /**
     * Emite el perfil guardado o null si aún no se ha completado el registro inicial.
     */
    val citizenProfileFlow: Flow<CitizenProfile?> = context.dataStore.data.map { preferences ->
        val dni = preferences[KEY_DNI] ?: ""
        val fullName = preferences[KEY_FULL_NAME] ?: ""
        val age = preferences[KEY_AGE] ?: 0
        val phone = preferences[KEY_PHONE] ?: ""

        val profile = CitizenProfile(
            dni = dni,
            fullName = fullName,
            age = age,
            phone = phone
        )

        if (profile.isValid()) profile else null
    }

    /**
     * Guarda de forma persistente los datos del ciudadano tras validar.
     */
    suspend fun saveProfile(profile: CitizenProfile) {
        context.dataStore.edit { preferences ->
            preferences[KEY_DNI] = profile.dni.trim()
            preferences[KEY_FULL_NAME] = profile.fullName.trim()
            preferences[KEY_AGE] = profile.age
            preferences[KEY_PHONE] = profile.phone.trim()
        }
    }

    /**
     * Limpia los datos locales del ciudadano (para propósitos de testing o cambio de usuario).
     */
    suspend fun clearProfile() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}
