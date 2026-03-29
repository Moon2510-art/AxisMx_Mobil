<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\VehiculoController;

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

// ACCESOS
Route::post('/verificar', [AccesoController::class, 'verificarCredencial']);
Route::post('/verificar-placa', [AccesoController::class, 'verificarPlaca']);
Route::get('/accesos', [AccesoController::class, 'historial']);

// VEHICULOS
Route::post('/vehiculos', [VehiculoController::class, 'store']);
Route::get('/vehiculos', [VehiculoController::class, 'index']);
Route::delete('/vehiculos/{id}', [VehiculoController::class, 'destroy']);