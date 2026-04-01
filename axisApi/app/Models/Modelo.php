<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modelo extends Model
{
    protected $table = 'Modelos';
    protected $primaryKey = 'ID_Modelo';
    public $timestamps = false;

    protected $fillable = [
        'Nombre_Modelo',
        'ID_Marca'
    ];

    public function marca()
    {
        return $this->belongsTo(Marca::class, 'ID_Marca');
    }
}