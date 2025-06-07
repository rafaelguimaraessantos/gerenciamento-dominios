<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    protected $fillable = [
        'nome', 'dominio', 'cliente', 'ativo', 'data_registro', 'data_expiracao', 'observacoes'
    ];
}
