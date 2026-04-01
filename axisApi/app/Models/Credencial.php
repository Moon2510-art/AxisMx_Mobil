<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Credencial extends Model
{
    protected $table = 'Credenciales';
    protected $primaryKey = 'ID_Credencial';
    public $timestamps = false;

    protected $fillable = [
        'Codigo_Credencial',
        'ID_Usuario',
        'Fecha_Emision',
        'Fecha_Expiracion',
        'ID_Estado'
    ];

    protected $casts = [
        'Fecha_Emision' => 'date',
        'Fecha_Expiracion' => 'date'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'ID_Usuario');
    }
}