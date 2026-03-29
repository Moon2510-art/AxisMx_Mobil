<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'Vehiculos';
    protected $primaryKey = 'ID_Vehiculo';
    public $timestamps = false;

    protected $fillable = [
        'Placa',
        'ID_Modelo',
        'Anio',
        'Color',
        'ID_Estado'
    ];

    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'ID_Modelo');
    }

    public function propietarios()
    {
        return $this->belongsToMany(
            Usuario::class,
            'Propietarios_Vehiculos',
            'ID_Vehiculo',
            'ID_Usuario'
        )->withPivot('Fecha_Asignacion', 'Fecha_Fin');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'ID_Estado');
    }
}