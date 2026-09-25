package com.guadalupe.alerta

import android.app.Application
import com.guadalupe.alerta.data.datastore.ProfileDataStore
import com.guadalupe.alerta.data.location.LocationService
import com.guadalupe.alerta.data.repository.AlertRepository
import com.guadalupe.alerta.data.repository.AlertRepositoryImpl

class AlertaApplication : Application() {

    lateinit var profileDataStore: ProfileDataStore
        private set

    lateinit var locationService: LocationService
        private set

    lateinit var alertRepository: AlertRepository
        private set

    override fun onCreate() {
        super.onCreate()
        profileDataStore = ProfileDataStore(this)
        locationService = LocationService(this)
        alertRepository = AlertRepositoryImpl(profileDataStore)
    }
}
