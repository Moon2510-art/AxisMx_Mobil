<?php

namespace App\Http\Controllers;

use App\Models\RegistroAcceso;
use App\Models\Credencial;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AccesoController extends Controller
{
    public function verificarCredencial(Request $request)
    {
        // Lógica para verificar credencial
        // ...
    }

    public function verificarPlaca(Request $request)
    {
        // Lógica para verificar placa
        // ...
    }

    public function historial(Request $request)
    {
        // Lógica para obtener historial
        // ...
    }

    public function stats(Request $request)
    {
        try {
            $vehiculares = RegistroAcceso::where('ID_Tipo_Acceso', 2)
                ->whereBetween('Fecha_Hora', [now()->startOfWeek(), now()->endOfWeek()])
                ->count();
                
            $peatonales = RegistroAcceso::where('ID_Tipo_Acceso', 1)
                ->whereBetween('Fecha_Hora', [now()->startOfWeek(), now()->endOfWeek()])
                ->count();
                
            $zonas = ['Entrada Principal', 'Entrada Secundaria', 'Estacionamiento Norte', 'Estacionamiento Sur'];
            $zonaMasTrafico = $zonas[array_rand($zonas)];
            
            return response()->json([
                'success' => true,
                'data' => [
                    'accesosVehiculares' => $vehiculares,
                    'accesosPeatonales' => $peatonales,
                    'totalAccesos' => $vehiculares + $peatonales,
                    'zonaMasTrafico' => $zonaMasTrafico
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas'
            ], 500);
        }
    }

    public function recent(Request $request)
    {
        try {
            $limit = $request->get('limit', 10);
            
            $registros = RegistroAcceso::with(['credencial.usuario', 'vehiculo', 'tipoAcceso'])
                ->orderBy('Fecha_Hora', 'desc')
                ->limit($limit)
                ->get()
                ->map(function($registro) {
                    $zonas = ['Entrada Principal', 'Entrada Secundaria', 'Estacionamiento Norte', 'Estacionamiento Sur'];
                    return [
                        'ID_Registro' => $registro->ID_Registro,
                        'Fecha_Hora' => $registro->Fecha_Hora,
                        'Acceso_Autorizado' => $registro->Acceso_Autorizado,
                        'usuario' => $registro->credencial ? $registro->credencial->usuario : null,
                        'tipoAcceso' => $registro->tipoAcceso,
                        'Codigo_Credencial' => $registro->credencial ? $registro->credencial->Codigo_Credencial : null,
                        'Placa' => $registro->vehiculo ? $registro->vehiculo->Placa : null,
                        'zona' => $zonas[array_rand($zonas)]
                    ];
                });
                
            return response()->json([
                'success' => true,
                'data' => $registros
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener accesos recientes'
            ], 500);
        }
    }
}