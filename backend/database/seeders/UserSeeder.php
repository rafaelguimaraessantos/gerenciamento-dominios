<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@example.com',
            'password' => Hash::make('123456'),
        ]);

        User::create([
            'name' => 'Usuário Teste',
            'email' => 'usuario@example.com',
            'password' => Hash::make('senha123'),
        ]);
    }
}
