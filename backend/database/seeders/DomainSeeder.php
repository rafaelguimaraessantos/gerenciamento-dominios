<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Domain; 

class DomainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Domain::create([
            'nome' => 'Google',
            'dominio' => 'google.com',
            'cliente' => 'Google LLC',
            'ativo' => true,
            'data_registro' => '2024-01-01',
            'data_expiracao' => '2025-01-01',
            'observacoes' => 'Domínio principal do Google',
        ]);
    }
}

