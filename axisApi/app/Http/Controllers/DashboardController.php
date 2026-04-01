<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegistroAcceso;
use App\Models\Usuario;
use App\Models\Vehiculo;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            $totalHoy = RegistroAcceso::whereDate('Fecha_Hora', today())->count();
            $autorizadosHoy = RegistroAcceso::whereDate('Fecha_Hora', today())
                ->where('Acceso_Autorizado', true)
                ->count();
            $denegadosHoy = $totalHoy - $autorizadosHoy;
            $usuariosActivos = Usuario::where('ID_Estado', 1)->count();
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

    public function getUserStats($userId)
    {
        try {
            $misAccesosMes = RegistroAcceso::whereHas('credencial', function($q) use ($userId) {
                $q->where('ID_Usuario', $userId);
            })
            ->whereMonth('Fecha_Hora', now()->month)
            ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'mis_accesos_mes' => $misAccesosMes,
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