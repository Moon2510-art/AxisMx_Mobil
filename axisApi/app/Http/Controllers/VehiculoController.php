<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehiculoController extends Controller
{
    public function index()
    {
        $vehiculos = DB::table('vehiculos')->get();
        return response()->json($vehiculos);
    }

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