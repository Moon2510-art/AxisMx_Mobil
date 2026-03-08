<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccesoController extends Controller
{

    /* ACCESO PEATONAL OCR */
    public function verificarCredencial(Request $request)
    {

        $codigo = $request->codigo;

        $usuario = DB::table('usuarios')
        ->where('Matricula',$codigo)
        ->first();

        if(!$usuario)
        {
            return response()->json([
                "autorizado"=>false
            ]);
        }

        DB::table('accesos')->insert([
            'ID_Usuario'=>$usuario->ID_Usuario,
            'Metodo'=>'OCR_CREDENCIAL',
            'Tipo'=>'entrada',
            'Fecha'=>now(),
            'Dispositivo'=>'peatonal'
        ]);

        return response()->json([
            "autorizado"=>true,
            "usuario"=>$usuario->Nombre
        ]);
    }

    /* ACCESO VEHICULAR OCR */

    public function verificarPlaca(Request $request)
    {

        $placa = $request->placa;

        $vehiculo = DB::table('vehiculos')
        ->where('Placa',$placa)
        ->first();

        if(!$vehiculo)
        {
            return response()->json([
                "autorizado"=>false
            ]);
        }

        DB::table('accesos')->insert([
            'ID_Usuario'=>$vehiculo->ID_Usuario,
            'Placa'=>$placa,
            'Metodo'=>'OCR_PLACA',
            'Tipo'=>'entrada',
            'Fecha'=>now(),
            'Dispositivo'=>'vehicular'
        ]);

        return response()->json([
            "autorizado"=>true
        ]);
    }

    public function historial()
    {
        $accesos = DB::table('accesos')
        ->join('usuarios','accesos.ID_Usuario','=','usuarios.ID_Usuario')
        ->select('usuarios.Nombre','accesos.*')
        ->get();

        return response()->json($accesos);
    }

}
