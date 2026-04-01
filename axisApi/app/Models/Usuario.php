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
        'Contrasena',
        'ID_Estado'
    ];
    
    protected $hidden = [
        'Contrasena'
    ];
    
    // Relación con Rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'ID_Rol');
    }
    
    // Relación con Estado
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'ID_Estado');
    }
    
    // ESTE MÉTODO DEBE ESTAR SOLO UNA VEZ
    public function getAuthPassword()
    {
        return $this->Contrasena;
    }
    
    // Scope para usuarios activos
    public function scopeActivo($query)
    {
        return $query->where('ID_Estado', 1);
    }

    // Relación con vehículos (uno a muchos, por ID_Usuario)
public function vehiculos()
{
    return $this->hasMany(Vehiculo::class, 'ID_Usuario');
}

// Relación con credenciales
public function credenciales()
{
    return $this->hasMany(Credencial::class, 'ID_Usuario');
}
}