<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::with('rol')->get();
        return response()->json($usuarios);
    }

    public function show($id)
    {
        $usuario = Usuario::with('rol')->find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return response()->json($usuario);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
                'apellido_paterno' => 'required|string|max:100',
                'email' => 'required|email|unique:Usuarios,Email',
                'password' => 'required|string|min:6',
                'ID_Rol' => 'required|exists:Roles,ID_Rol',
            ]);

            $usuario = Usuario::create([
                'Nombre' => $request->nombre,
                'Ap_Paterno' => $request->apellido_paterno,
                'Ap_Materno' => $request->apellido_materno,
                'Email' => $request->email,
                'Telefono' => $request->telefono,
                'Matricula' => $request->matricula,
                'Numero_Empleado' => $request->numero_empleado,
                'ID_Rol' => $request->ID_Rol,
                'password' => Hash::make($request->password),
                'ID_Estado' => 2,
            ]);

            return response()->json([
                'success' => true,
                'data' => $usuario,
                'message' => 'Usuario creado exitosamente'
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
            \Log::info('Update usuario request:', [
                'id' => $id,
                'request_data' => $request->all()
            ]);

            $usuario = Usuario::find($id);
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            // Actualizar campos
            if ($request->has('Nombre')) {
                $usuario->Nombre = $request->Nombre;
            }
            if ($request->has('Ap_Paterno')) {
                $usuario->Ap_Paterno = $request->Ap_Paterno;
            }
            if ($request->has('Ap_Materno')) {
                $usuario->Ap_Materno = $request->Ap_Materno;
            }
            if ($request->has('Email')) {
                $usuario->Email = $request->Email;
            }
            if ($request->has('Telefono')) {
                $usuario->Telefono = $request->Telefono;
            }
            if ($request->has('ID_Rol')) {
                $usuario->ID_Rol = $request->ID_Rol;
            }
            if ($request->has('ID_Estado')) {
                $usuario->ID_Estado = (int) $request->ID_Estado;
            }

            $usuario->save();

            \Log::info('Usuario actualizado:', ['usuario' => $usuario]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => $usuario->fresh()->load('rol')
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar usuario:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $usuario = Usuario::find($id);
            if (!$usuario) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
            $usuario->delete();
            return response()->json(['message' => 'Usuario eliminado']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getPotentialOwners()
    {
        $rolesPermitidos = ['Alumno', 'Maestro', 'Administrativo'];
        
        $usuarios = Usuario::with('rol')
            ->whereIn('ID_Rol', function($query) use ($rolesPermitidos) {
                $query->select('ID_Rol')
                      ->from('Roles')
                      ->whereIn('Nombre_Rol', $rolesPermitidos);
            })
            ->where('ID_Estado', 1)
            ->orderBy('Nombre')
            ->get();
        
        return response()->json($usuarios);
    }

    public function getVisitantes()
{
    $visitantes = Usuario::with('rol')
        ->whereHas('rol', function($query) {
            $query->where('Nombre_Rol', 'Visitante');
        })
        ->orderBy('Fecha_Creacion', 'desc')
        ->get();
    
    return response()->json($visitantes);
}
}