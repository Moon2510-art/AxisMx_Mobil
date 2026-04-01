<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoAcceso extends Model
{
    protected $table = 'Tipos_Acceso';
    protected $primaryKey = 'ID_Tipo_Acceso';
    public $timestamps = false;

    protected $fillable = [
        'Nombre_Tipo',
        'Descripcion'
    ];
}