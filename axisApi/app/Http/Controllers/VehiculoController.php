<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index()
    {
        $vehiculos = Vehiculo::with(['modelo.marca', 'propietarios' => function($query) {
            // Solo propietarios activos (sin fecha de fin)
            $query->wherePivot('Fecha_Fin', null);
        }])->get();
        
        // Formatear para agregar el propietario actual
        $vehiculos->each(function($vehiculo) {
            $vehiculo->propietario_actual = $vehiculo->propietarios->first();
            unset($vehiculo->propietarios);
        });
        
    return response()->json($vehiculos);
}

// Los demás métodos (show, store, update, destroy) se mantienen
// pero desde la app de administración NO se usarán

    public function store(Request $request)
    {
        DB::table('vehiculos')->insert([
            'ID_Usuario' => $request->ID_Usuario,
            'Placa' => $request->Placa,
            'Marca' => $request->Marca,
            'Modelo' => $request->Modelo,
            'Color' => $request->Color
        ]);

        return response()->json([
            "message" => "Vehiculo registrado"
        ]);
    }

    public function update(Request $request, $id)
    {
        $datos = [];

        if ($request->has('Placa')) {
            $datos['Placa'] = $request->input('Placa');
        }
        if ($request->has('ID_Modelo')) {
            $datos['ID_Modelo'] = $request->input('ID_Modelo');
        }
        if ($request->has('Anio')) {
            $datos['Anio'] = $request->input('Anio');
        }
        if ($request->has('Color')) {
            $datos['Color'] = $request->input('Color');
        }
        if ($request->has('ID_Estado')) {
            $datos['ID_Estado'] = $request->input('ID_Estado');
        }

        DB::table('vehiculos')
            ->where('ID_Vehiculo', $id)
            ->update($datos);

        return response()->json([
            "message" => "Vehiculo actualizado"
        ]);
    }

    public function destroy($id)
    {
        DB::table('vehiculos')
        ->where('ID_Vehiculo',$id)
        ->delete();

        return response()->json([
            "message" => "Vehiculo eliminado"
        ]);
    }
}