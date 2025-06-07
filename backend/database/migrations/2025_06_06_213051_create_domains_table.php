<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDomainsTable extends Migration
{
    public function up()
    {
        Schema::create('domains', function (Blueprint $table) {
            $table->id(); // id autoincremento
            $table->string('nome'); // nome do domínio, ex: "Google"
            $table->string('dominio')->unique(); // domínio único, ex: "google.com"
            $table->string('cliente'); // nome do cliente ou empresa
            $table->boolean('ativo')->default(true); // ativo/inativo, default true
            $table->date('data_registro'); // data de registro
            $table->date('data_expiracao')->nullable(); // data de expiração, pode ser nulo
            $table->text('observacoes')->nullable(); // observações opcionais
            $table->timestamps(); // created_at e updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('domains');
    }
}
