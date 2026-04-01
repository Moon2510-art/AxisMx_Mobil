public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'  // <--- CAMBIADO
    ]);

    $usuario = Usuario::with('rol')->where('Email', $request->email)->first();

    if (!$usuario) {
        return response()->json([
            'success' => false,
            'message' => 'Credenciales incorrectas'
        ], 401);
    }

    if (!Hash::check($request->password, $usuario->password)) {  // <--- CAMBIADO
        return response()->json([
            'success' => false,
            'message' => 'Credenciales incorrectas'
        ], 401);
    }

    // ... resto del código igual
}