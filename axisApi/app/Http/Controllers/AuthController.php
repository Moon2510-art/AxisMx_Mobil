<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Credencial;

class AuthController extends Controller
{
    /**
     * Iniciar sesión
     */
    public function login(Request $request)
    {
        // Validar campos
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        // Buscar usuario por email
        $usuario = Usuario::with('rol')->where('Email', $request->email)->first();

        // Verificar existencia
        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Verificar contraseña
        // IMPORTANTE: el campo real en la tabla Usuarios se llama 'Contrasena'
        if (!Hash::check($request->password, $usuario->Contrasena)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Obtener el rol del usuario
        $rolUsuario = $usuario->rol->Nombre_Rol ?? '';

        // Verificar que el usuario esté activo (opcional, dependiendo del modelo)
        // if ($usuario->ID_Estado != 1) { // Asumiendo 1 es activo
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Usuario inactivo'
        //     ], 403);
        // }

        // Crear token
        $token = $usuario->createToken('auth-token')->plainTextToken;

        // Respuesta
        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => [
                'user' => [
                    'id'                => $usuario->ID_Usuario,
                    'nombre'            => $usuario->Nombre,
                    'apellido_paterno'  => $usuario->Ap_Paterno,
                    'email'             => $usuario->Email,
                    'rol'               => $rolUsuario,
                    'estado'            => $usuario->ID_Estado
                ],
                'token'      => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    public function register(Request $request)
{
    try {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'email' => 'required|email|unique:Usuarios,Email',
            'password' => 'required|string|min:6|confirmed',
            'matricula' => 'nullable|string|max:9|unique:Usuarios,Matricula',
            'numero_empleado' => 'nullable|string|max:20|unique:Usuarios,Numero_Empleado',
            'telefono' => 'nullable|string|max:20',
            'codigo_credencial' => 'required|string|unique:Credenciales,Codigo_Credencial|min:8|max:20' // NUEVO: código de credencial
        ]);

        // Validar que tenga matrícula o número de empleado
        if (!$request->matricula && !$request->numero_empleado) {
            return response()->json([
                'success' => false,
                'message' => 'Debes proporcionar matrícula o número de empleado'
            ], 400);
        }

        // Buscar el rol "Alumno" por defecto (o el que corresponda)
        $rolAlumno = Rol::where('Nombre_Rol', 'Alumno')->first();
        
        if (!$rolAlumno) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la configuración del sistema. Contacte al administrador.'
            ], 500);
        }

        // Crear usuario con estado INACTIVO (ID_Estado = 2)
        $usuario = Usuario::create([
            'Matricula' => $request->matricula,
            'Numero_Empleado' => $request->numero_empleado,
            'Nombre' => $request->nombre,
            'Ap_Paterno' => $request->apellido_paterno,
            'Ap_Materno' => $request->apellido_materno,
            'Email' => $request->email,
            'Telefono' => $request->telefono,
            'Empresa' => $request->empresa,
            'ID_Rol' => $rolAlumno->ID_Rol,
            'Contrasena' => Hash::make($request->password),
            'ID_Estado' => 2, // INACTIVO
        ]);

        // CREAR LA CREDENCIAL DEL USUARIO
        $credencial = Credencial::create([
            'Codigo_Credencial' => $request->codigo_credencial,
            'ID_Usuario' => $usuario->ID_Usuario,
            'Fecha_Emision' => now(),
            'ID_Estado' => 1, // Activa
        ]);

        Log::info('Nuevo registro de usuario', [
            'user_id' => $usuario->ID_Usuario,
            'email' => $usuario->Email,
            'credencial' => $credencial->Codigo_Credencial,
            'status' => 'inactivo'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registro exitoso. Tu cuenta está pendiente de activación por un administrador.',
            'data' => [
                'user' => [
                    'id' => $usuario->ID_Usuario,
                    'nombre' => $usuario->Nombre,
                    'email' => $usuario->Email,
                    'estado' => 'Inactivo'
                ],
                'credencial' => [
                    'codigo' => $credencial->Codigo_Credencial,
                    'fecha_emision' => $credencial->Fecha_Emision
                ]
            ]
        ], 201);

    } catch (\Exception $e) {
        Log::error('Error en registro', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error en el servidor: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Listar usuarios pendientes de activación (solo administradores/seguridad)
     */
    public function pendingUsers(Request $request)
    {
        try {
            $admin = $request->user();
            if (!$admin || !in_array($admin->rol->Nombre_Rol ?? '', ['Administrador', 'Seguridad'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos'
                ], 403);
            }

            $usuarios = Usuario::with('rol')
                ->where('ID_Estado', 2) // INACTIVOS
                ->orderBy('Fecha_Creacion', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data'    => $usuarios
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener usuarios pendientes', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios pendientes'
            ], 500);
        }
    }

    /**
     * Activar usuario (solo administradores/seguridad)
     */
    public function activateUser($id, Request $request)
    {
        try {
            $admin = $request->user();
            if (!$admin || !in_array($admin->rol->Nombre_Rol ?? '', ['Administrador', 'Seguridad'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para activar usuarios'
                ], 403);
            }

            $usuario = Usuario::find($id);

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            $usuario->ID_Estado = 1; // ACTIVO
            $usuario->save();

            Log::info('Usuario activado', [
                'admin_id'   => $admin->ID_Usuario,
                'user_id'    => $usuario->ID_Usuario,
                'user_email' => $usuario->Email
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario activado exitosamente',
                'data' => [
                    'id'     => $usuario->ID_Usuario,
                    'email'  => $usuario->Email,
                    'estado' => 'Activo'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al activar usuario', [
                'error'   => $e->getMessage(),
                'user_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al activar usuario'
            ], 500);
        }
    }

    
}