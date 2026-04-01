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
    $credencial = Credencial::with('usuario')
        ->where('Codigo_Credencial', $request->codigo_credencial)
        ->first();

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
            'mensaje' => 'Usuario inactivo'
        ]);
    }

    return response()->json([
        'success' => true,
        'acceso_autorizado' => true,
        'mensaje' => 'Acceso autorizado',
        'usuario' => $usuario
    ]);

    }

    public function verificarPlaca(Request $request)
{
    $imageBase64 = $request->input('image');

    if (!$imageBase64) {
        return response()->json([
            'success' => false,
            'acceso_autorizado' => false,
            'mensaje' => 'Imagen no recibida'
        ]);
    }

    try {
        // Limpiar base64
        $imageBase64 = str_replace('data:image/jpeg;base64,', '', $imageBase64);
        $image = base64_decode($imageBase64);

        $filePath = storage_path('app/placa.jpg');
        file_put_contents($filePath, $image);

        // 🔥 OCR REAL (rápido usando Tesseract)
        $output = shell_exec("tesseract $filePath stdout 2>/dev/null");

        $placa = strtoupper(preg_replace('/[^A-Z0-9]/', '', $output));

        if (!$placa) {
            return response()->json([
                'success' => true,
                'acceso_autorizado' => false,
                'mensaje' => 'No se pudo detectar la placa'
            ]);
        }

        $vehiculo = Vehiculo::where('Placa', $placa)->first();

        if (!$vehiculo) {
            return response()->json([
                'success' => true,
                'acceso_autorizado' => false,
                'mensaje' => "Placa $placa no registrada"
            ]);
        }

        return response()->json([
            'success' => true,
            'acceso_autorizado' => true,
            'mensaje' => "Acceso autorizado: $placa",
            'placa' => $placa,
            'vehiculo' => $vehiculo
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'acceso_autorizado' => false,
            'mensaje' => 'Error procesando imagen'
        ]);
    }
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

    private function simularOCR()
{
    $letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return 
        $letras[rand(0,25)] .
        $letras[rand(0,25)] .
        $letras[rand(0,25)] .
        '-' .
        rand(100,999);
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