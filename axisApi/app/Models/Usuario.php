<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Model implements Authenticatable
{
    use AuthenticatableTrait, HasApiTokens;

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
        'ID_Rol',
        'password',
        'ID_Estado'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'Fecha_Creacion' => 'datetime'
    ];

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'ID_Rol');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'ID_Estado');
    }

    public function getAuthPassword()
    {
        return $this->password;
    }

    // Método para autenticación con Sanctum
    public function getAuthIdentifierName()
    {
        return 'ID_Usuario';
    }

    public function getAuthIdentifier()
    {
        return $this->getKey();
    }

    public function getAuthPasswordName()
    {
        return 'password';
    }

    public function scopeActivo($query)
    {
        return $query->where('ID_Estado', 1);
    }
}