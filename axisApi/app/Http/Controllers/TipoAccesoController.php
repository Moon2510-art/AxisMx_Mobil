<?php

namespace App\Http\Controllers;

use App\Models\TipoAcceso;
use Illuminate\Http\Request;

class TipoAccesoController extends Controller
{
    public function index()
    {
        $tipos = TipoAcceso::all();
        return response()->json($tipos);
    }
}