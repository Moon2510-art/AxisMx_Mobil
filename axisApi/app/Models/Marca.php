<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    protected $table = 'Marcas';
    protected $primaryKey = 'ID_Marca';
    public $timestamps = false;

    protected $fillable = [
        'Nombre_Marca'
    ];

    public function modelos()
    {
        return $this->hasMany(Modelo::class, 'ID_Marca');
    }
}