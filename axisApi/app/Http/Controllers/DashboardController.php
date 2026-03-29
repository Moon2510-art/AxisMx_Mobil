<?php

namespace App\Http\Controllers;

use App\Models\RegistroAcceso;
use App\Models\Usuario;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            // Total de accesos hoy
            $totalHoy = RegistroAcceso::whereDate('Fecha_Hora', today())->count();
            
            // Accesos autorizados hoy
            $autorizadosHoy = RegistroAcceso::whereDate('Fecha_Hora', today())
                ->where('Acceso_Autorizado', true)
                ->count();
            
            // Accesos denegados hoy
            $denegadosHoy = RegistroAcceso::whereDate('Fecha_Hora', today())
                ->where('Acceso_Autorizado', false)
                ->count();
            
            // Total de usuarios activos (ID_Estado = 1)
            $usuariosActivos = Usuario::where('ID_Estado', 1)->count();
            
            // Total de vehículos registrados (ID_Estado = 1)
            $vehiculosRegistrados = Vehiculo::where('ID_Estado', 1)->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_accesos_hoy' => $totalHoy,
                    'accesos_autorizados_hoy' => $autorizadosHoy,
                    'accesos_denegados_hoy' => $denegadosHoy,
                    'usuarios_activos' => $usuariosActivos,
                    'vehiculos_registrados' => $vehiculosRegistrados,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}