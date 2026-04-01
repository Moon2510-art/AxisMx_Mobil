<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistroAcceso extends Model
{
    protected $table = 'Registros_Acceso';
    protected $primaryKey = 'ID_Registro';
    public $timestamps = false;

    protected $fillable = [
        'Fecha_Hora',
        'ID_Credencial',
        'ID_Vehiculo',
        'ID_Tipo_Acceso',
        'Acceso_Autorizado',
        'ID_Usuario_Validador',
        'Observaciones'
    ];

    protected $casts = [
        'Fecha_Hora' => 'datetime',
        'Acceso_Autorizado' => 'boolean'
    ];

    public function tipoAcceso()
    {
        return $this->belongsTo(TipoAcceso::class, 'ID_Tipo_Acceso');
    }
    public function credencial()
{
    return $this->belongsTo(Credencial::class, 'ID_Credencial');
}
public function vehiculo()
{
    return $this->belongsTo(Vehiculo::class, 'ID_Vehiculo');
}
}