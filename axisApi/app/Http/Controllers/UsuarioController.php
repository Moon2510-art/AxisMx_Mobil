<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Credencial;

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
            'codigo_credencial' => 'required|string|unique:Credenciales,Codigo_Credencial|min:8|max:20'  // NUEVO
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
            'Contrasena' => Hash::make($request->password),
            'ID_Estado' => 2, // Inactivo por defecto
        ]);

        // CREAR LA CREDENCIAL DEL USUARIO
        Credencial::create([
            'Codigo_Credencial' => $request->codigo_credencial,
            'ID_Usuario' => $usuario->ID_Usuario,
            'Fecha_Emision' => now(),
            'ID_Estado' => 1, // Activa
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

        // Actualizar credencial si se envió
        if ($request->has('Codigo_Credencial')) {
            $credencial = Credencial::where('ID_Usuario', $id)->first();
            if ($credencial) {
                $credencial->Codigo_Credencial = $request->Codigo_Credencial;
                $credencial->save();
            } else {
                Credencial::create([
                    'Codigo_Credencial' => $request->Codigo_Credencial,
                    'ID_Usuario' => $id,
                    'Fecha_Emision' => now(),
                    'ID_Estado' => 1
                ]);
            }
        }

        // Actualizar contraseña si se envió
        if ($request->has('Password') && !empty($request->Password)) {
            $usuario->Contrasena = Hash::make($request->Password);
            $usuario->save();
        }

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


    public function getAccesos($id)
{
    try {
        \Log::info('getAccesos llamado con ID: ' . $id);
        
        $usuario = Usuario::find($id);
        
        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $accesos = \App\Models\RegistroAcceso::whereHas('credencial', function($q) use ($id) {
            $q->where('ID_Usuario', $id);
        })
        ->orWhere('ID_Usuario_Validador', $id)
        ->with('tipoAcceso')
        ->orderBy('Fecha_Hora', 'desc')
        ->limit(50)
        ->get();

        $formatted = $accesos->map(function($acceso) {
            return [
                'id' => $acceso->ID_Registro,
                'tipo' => $acceso->Acceso_Autorizado ? 'Entrada' : 'Salida',
                'fecha' => $acceso->Fecha_Hora->format('Y-m-d'),
                'hora' => $acceso->Fecha_Hora->format('H:i'),
                'lugar' => $acceso->tipoAcceso ? $acceso->tipoAcceso->Nombre_Tipo : 'Acceso'
            ];
        });

        return response()->json($formatted);
        
    } catch (\Exception $e) {
        \Log::error('Error en getAccesos: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
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

    public function getCredencial($id)
{
    \Log::info('getCredencial llamado con ID: ' . $id);
    
    $usuario = Usuario::find($id);
    
    \Log::info('Usuario encontrado: ' . ($usuario ? 'Sí' : 'No'));
    
    if (!$usuario) {
        return response()->json([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ], 404);
    }

    \Log::info('Buscando credencial activa');
    
    $credencial = $usuario->credenciales()
        ->where('ID_Estado', 1)
        ->where(function($q) {
            $q->whereNull('Fecha_Expiracion')
              ->orWhere('Fecha_Expiracion', '>=', now());
        })
        ->first();

    \Log::info('Credencial encontrada: ' . ($credencial ? 'Sí' : 'No'));

    if (!$credencial) {
        \Log::info('Creando nueva credencial');
        $codigo = $this->generarCodigoCredencial($usuario->ID_Usuario);
        $credencial = Credencial::create([
            'Codigo_Credencial' => $codigo,
            'ID_Usuario' => $usuario->ID_Usuario,
            'Fecha_Emision' => now(),
            'ID_Estado' => 1
        ]);
    }

    return response()->json([
        'success' => true,
        'data' => [
            'codigo' => $credencial->Codigo_Credencial,
            'fecha_emision' => $credencial->Fecha_Emision,
            'fecha_expiracion' => $credencial->Fecha_Expiracion
        ]
    ]);
}

private function generarCodigoCredencial($userId)
{
    return str_pad($userId, 8, '0', STR_PAD_LEFT) . rand(1000, 9999);
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

public function getVehiculos($id)
{
    \Log::info('getVehiculos llamado con ID: ' . $id);
    
    $usuario = Usuario::find($id);
    
    \Log::info('Usuario encontrado: ' . ($usuario ? 'Sí' : 'No'));
    
    if (!$usuario) {
        return response()->json([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ], 404);
    }

    $vehiculos = $usuario->vehiculos()->with('modelo.marca')->get();
    
    \Log::info('Vehículos encontrados: ' . $vehiculos->count());

    return response()->json([
        'success' => true,
        'data' => $vehiculos
    ]);
}
}