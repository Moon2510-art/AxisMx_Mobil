<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehiculoController extends Controller
{
    public function index()
    {
        $vehiculos = Vehiculo::with(['modelo.marca', 'usuario'])->get();
        
        // Formatear para agregar el propietario actual
        $vehiculos->each(function($vehiculo) {
            $vehiculo->propietario_actual = $vehiculo->usuario;
            unset($vehiculo->usuario);
        });
        
        return response()->json($vehiculos);
    }

    public function getByUser($userId)
    {
        $vehiculos = Vehiculo::where('ID_Usuario', $userId)
            ->with('modelo.marca')
            ->get();
        
        return response()->json($vehiculos);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'Placa' => 'required|unique:Vehiculos',
                'ID_Modelo' => 'required|exists:Modelos,ID_Modelo',
                'ID_Usuario' => 'required|exists:Usuarios,ID_Usuario',
                'Anio' => 'nullable|integer',
                'Color' => 'nullable|string',
                'ID_Estado' => 'nullable|integer'
            ]);

            $vehiculo = Vehiculo::create([
                'Placa' => strtoupper($request->Placa),
                'ID_Modelo' => $request->ID_Modelo,
                'ID_Usuario' => $request->ID_Usuario,
                'Anio' => $request->Anio,
                'Color' => $request->Color,
                'ID_Estado' => $request->ID_Estado ?? 1
            ]);

            return response()->json([
                'success' => true,
                'data' => $vehiculo,
                'message' => 'Vehículo registrado exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $vehiculo = Vehiculo::find($id);
            if (!$vehiculo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehículo no encontrado'
                ], 404);
            }

            if ($request->has('Placa')) {
                $vehiculo->Placa = strtoupper($request->Placa);
            }
            if ($request->has('ID_Modelo')) {
                $vehiculo->ID_Modelo = $request->ID_Modelo;
            }
            if ($request->has('Anio')) {
                $vehiculo->Anio = $request->Anio;
            }
            if ($request->has('Color')) {
                $vehiculo->Color = $request->Color;
            }
            if ($request->has('ID_Estado')) {
                $vehiculo->ID_Estado = $request->ID_Estado;
            }

            $vehiculo->save();

            return response()->json([
                'success' => true,
                'message' => 'Vehículo actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            \Log::info('Eliminando vehículo ID: ' . $id);
            
            $vehiculo = Vehiculo::find($id);
            if (!$vehiculo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehículo no encontrado'
                ], 404);
            }
            
            $vehiculo->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Vehículo eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar vehículo: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}