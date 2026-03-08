<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index()
    {
        return Usuario::all();
    }

    public function show($id)
{
    $usuario = DB::table('usuarios')
        ->where('ID_Usuario', $id)
        ->first();

    return response()->json($usuario);
}
public function store(Request $request)
{
    $id = DB::table('usuarios')->insertGetId([
        'Matricula' => $request->Matricula,
        'Numero_Empleado' => $request->Numero_Empleado,
        'Nombre' => $request->Nombre,
        'Ap_Paterno' => $request->Ap_Paterno,
        'Ap_Materno' => $request->Ap_Materno,
        'Email' => $request->Email,
        'Telefono' => $request->Telefono,
        'Empresa' => $request->Empresa,
        'ID_Estado' => $request->ID_Estado,
        'Fecha_Creacion' => now()
    ]);

    return response()->json([
        "message" => "Usuario creado",
        "id" => $id
    ]);
}
public function update(Request $request, $id)
{
    DB::table('usuarios')
        ->where('ID_Usuario', $id)
        ->update([
            'Telefono' => $request->Telefono,
            'Email' => $request->Email
        ]);

    return response()->json([
        "message" => "Usuario actualizado"
    ]);
}
}


