<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use Illuminate\Http\Request;

class RolController extends Controller
{
    public function index()
    {
        $roles = Rol::all();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Nombre_Rol' => 'required|unique:Roles',
            'Descripcion' => 'nullable|string'
        ]);

        $rol = Rol::create([
            'Nombre_Rol' => $request->Nombre_Rol,
            'Descripcion' => $request->Descripcion
        ]);

        return response()->json($rol, 201);
    }

    public function update(Request $request, $id)
    {
        $rol = Rol::find($id);
        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $rol->Descripcion = $request->Descripcion ?? $rol->Descripcion;
        $rol->save();

        return response()->json($rol);
    }

    public function destroy($id)
    {
        $rol = Rol::find($id);
        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $rol->delete();
        return response()->json(['message' => 'Rol eliminado']);
    }
}