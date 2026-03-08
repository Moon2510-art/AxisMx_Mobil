<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'Usuarios';
    protected $primaryKey = 'ID_Usuario';

    public $timestamps = false;

    protected $fillable = [
        'Matricula',
        'Numero_Empleado',
        'Nombre',
        'Ap_Paterno',
        'Ap_Materno',
        'Email',
        'Telefono',
        'Empresa',
        'ID_Estado'
    ];
}