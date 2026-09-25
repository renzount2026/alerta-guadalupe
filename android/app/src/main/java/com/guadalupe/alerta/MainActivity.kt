package com.guadalupe.alerta

import android.Manifest
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.guadalupe.alerta.ui.profile.ProfileScreen
import com.guadalupe.alerta.ui.profile.ProfileViewModel
import com.guadalupe.alerta.ui.profile.ProfileViewModelFactory
import com.guadalupe.alerta.ui.report.ReportDashboardScreen
import com.guadalupe.alerta.ui.report.ReportViewModel
import com.guadalupe.alerta.ui.report.ReportViewModelFactory
import com.guadalupe.alerta.ui.theme.AlertaGuadalupeTheme
import com.guadalupe.alerta.ui.theme.SurfaceDark

class MainActivity : ComponentActivity() {

    private val requestLocationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { _ ->
        // Permisos procesados
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Solicitar permisos de ubicación al inicio
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.READ_MEDIA_IMAGES)
            permissions.add(Manifest.permission.READ_MEDIA_VIDEO)
        }
        requestLocationPermissionLauncher.launch(permissions.toTypedArray())

        val app = application as AlertaApplication

        setContent {
            AlertaGuadalupeTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = SurfaceDark
                ) {
                    val profileViewModel: ProfileViewModel = viewModel(
                        factory = ProfileViewModelFactory(app.profileDataStore)
                    )
                    val profileState by profileViewModel.uiState.collectAsState()

                    var editingProfile by remember { mutableStateOf(false) }

                    // Si el usuario aún no tiene registro o desea editarlo, mostramos ProfileScreen
                    if (!profileState.isRegistered || editingProfile) {
                        ProfileScreen(
                            viewModel = profileViewModel,
                            onProfileConfigured = {
                                editingProfile = false
                            }
                        )
                    } else {
                        val reportViewModel: ReportViewModel = viewModel(
                            factory = ReportViewModelFactory(
                                app.profileDataStore,
                                app.locationService,
                                app.alertRepository
                            )
                        )

                        ReportDashboardScreen(
                            viewModel = reportViewModel,
                            onNavigateToProfile = {
                                editingProfile = true
                            }
                        )
                    }
                }
            }
        }
    }
}
