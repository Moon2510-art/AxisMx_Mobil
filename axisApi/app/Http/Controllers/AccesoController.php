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
        try {
            $request->validate([
                'codigo_credencial' => 'required|string'
            ]);

            $credencial = Credencial::with('usuario')->where('Codigo_Credencial', $request->codigo_credencial)->first();

            if (!$credencial) {
                return response()->json([
                    'success' => false,
                    'acceso_autorizado' => false,
                    'mensaje' => 'Credencial no encontrada'
                ]);
            }

            $usuario = $credencial->usuario;

            if ($usuario->ID_Estado != 1) {
                return response()->json([
                    'success' => true,
                    'acceso_autorizado' => false,
                    'mensaje' => 'Usuario inactivo. Contacte al administrador.'
                ]);
            }

            // Registrar acceso
            $registro = RegistroAcceso::create([
                'ID_Credencial' => $credencial->ID_Credencial,
                'ID_Tipo_Acceso' => 1, // Peatonal
                'Acceso_Autorizado' => true,
                'Observaciones' => 'Acceso peatonal autorizado'
            ]);

            return response()->json([
                'success' => true,
                'acceso_autorizado' => true,
                'mensaje' => 'Acceso autorizado',
                'data' => $registro
            ]);

        } catch (\Exception $e) {
            Log::error('Error en verificarCredencial: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function verificarPlaca(Request $request)
    {
        try {
            $request->validate([
                'placa' => 'required|string'
            ]);

            $vehiculo = Vehiculo::with(['modelo.marca', 'usuario'])->where('Placa', $request->placa)->first();

            if (!$vehiculo) {
                return response()->json([
                    'success' => false,
                    'acceso_autorizado' => false,
                    'mensaje' => 'Vehículo no registrado'
                ]);
            }

            $usuario = $vehiculo->usuario;

            if (!$usuario || $usuario->ID_Estado != 1) {
                return response()->json([
                    'success' => true,
                    'acceso_autorizado' => false,
                    'mensaje' => 'Usuario inactivo o vehículo sin propietario válido'
                ]);
            }

            // Registrar acceso
            $registro = RegistroAcceso::create([
                'ID_Vehiculo' => $vehiculo->ID_Vehiculo,
                'ID_Tipo_Acceso' => 2, // Vehicular
                'Acceso_Autorizado' => true,
                'Observaciones' => 'Acceso vehicular autorizado'
            ]);

            return response()->json([
                'success' => true,
                'acceso_autorizado' => true,
                'mensaje' => 'Acceso autorizado',
                'data' => $registro
            ]);

        } catch (\Exception $e) {
            Log::error('Error en verificarPlaca: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function historial(Request $request)
    {
        try {
            $limit = $request->get('limit', 50);
            
            $registros = RegistroAcceso::with(['credencial.usuario', 'vehiculo', 'tipoAcceso'])
                ->orderBy('Fecha_Hora', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $registros
            ]);

        } catch (\Exception $e) {
            Log::error('Error en historial: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function stats(Request $request)
    {
        try {
            $totalHoy = RegistroAcceso::whereDate('Fecha_Hora', today())->count();
            $autorizadosHoy = RegistroAcceso::whereDate('Fecha_Hora', today())
                ->where('Acceso_Autorizado', true)
                ->count();
            $denegadosHoy = $totalHoy - $autorizadosHoy;

            return response()->json([
                'success' => true,
                'data' => [
                    'total_accesos_hoy' => $totalHoy,
                    'accesos_autorizados_hoy' => $autorizadosHoy,
                    'accesos_denegados_hoy' => $denegadosHoy
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error en stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
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
                    return [
                        'ID_Registro' => $registro->ID_Registro,
                        'Fecha_Hora' => $registro->Fecha_Hora,
                        'Acceso_Autorizado' => $registro->Acceso_Autorizado,
                        'usuario' => $registro->credencial ? $registro->credencial->usuario : null,
                        'vehiculo' => $registro->vehiculo,
                        'tipoAcceso' => $registro->tipoAcceso,
                        'Codigo_Credencial' => $registro->credencial ? $registro->credencial->Codigo_Credencial : null,
                        'Placa' => $registro->vehiculo ? $registro->vehiculo->Placa : null,
                    ];
                });
                
            return response()->json([
                'success' => true,
                'data' => $registros
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en recent: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}