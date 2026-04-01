<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ModeloController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\TipoAccesoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OCRController;



// AUTENTICACIÓN
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/auth/pending-users', [AuthController::class, 'pendingUsers'])->middleware('auth:sanctum');
Route::put('/auth/activate-user/{id}', [AuthController::class, 'activateUser'])->middleware('auth:sanctum');

// DASHBOARD
Route::get('/access/stats', [AccesoController::class, 'stats'])->middleware('auth:sanctum');
Route::get('/access/recent', [AccesoController::class, 'recent'])->middleware('auth:sanctum');

// USUARIOS
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
Route::get('/roles', [RolController::class, 'index']);
Route::get('/dashboard/user-stats/{userId}', [DashboardController::class, 'getUserStats'])->middleware('auth:sanctum');
Route::get('/usuarios/{id}/credencial', [UsuarioController::class, 'getCredencial'])->middleware('auth:sanctum');


// ACCESOS
Route::post('/verificar', [AccesoController::class, 'verificarCredencial']);
Route::post('/verificar-placa', [AccesoController::class, 'verificarPlaca']);
Route::get('/accesos', [AccesoController::class, 'historial']);
Route::get('/tipos-acceso', [TipoAccesoController::class, 'index']);
Route::get('/usuarios/{id}/accesos', [UsuarioController::class, 'getAccesos'])->middleware('auth:sanctum');
Route::post('/ocr-placa', [OCRController::class, 'recognizePlate']);
Route::post('/ocr', [OCRController::class, 'recognizeText'])->middleware('auth:sanctum');

// VEHICULOS
Route::post('/vehiculos', [VehiculoController::class, 'store']);
Route::get('/vehiculos', [VehiculoController::class, 'index']);
Route::put('/vehiculos/{id}', [VehiculoController::class, 'update']);
Route::delete('/vehiculos/{id}', [VehiculoController::class, 'destroy']);
Route::get('/modelos', [ModeloController::class, 'index']);
Route::get('/marcas', [MarcaController::class, 'index']);
Route::get('/usuarios/{id}/vehiculos', [UsuarioController::class, 'getVehiculos'])->middleware('auth:sanctum');
Route::get('/vehiculos/usuario/{userId}', [VehiculoController::class, 'getByUser'])->middleware('auth:sanctum');

//ROLES
Route::get('/roles', [RolController::class, 'index']);
Route::post('/roles', [RolController::class, 'store']);
Route::put('/roles/{id}', [RolController::class, 'update']);
Route::delete('/roles/{id}', [RolController::class, 'destroy']);

//VISITANTES
Route::get('/visitantes', [UsuarioController::class, 'getVisitantes']);

//DASHBOARD
Route::get('/dashboard/stats', [DashboardController::class, 'stats'])->middleware('auth:sanctum');
Route::get('/dashboard/user-stats/{userId}', [DashboardController::class, 'getUserStats'])->middleware('auth:sanctum');