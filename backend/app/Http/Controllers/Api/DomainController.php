<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Domain; 

class DomainController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $domains = Domain::all();
        return response()->json([
            'data' => $domains
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'dominio' => 'required|string|max:255|unique:domains,dominio',
            'cliente' => 'required|string|max:255',
            'ativo' => 'boolean',
            'data_registro' => 'required|date',
            'data_expiracao' => 'required|date|after_or_equal:data_registro',
            'observacoes' => 'nullable|string',
        ]);

        $domain = Domain::create($validated);

        return response()->json($domain, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $domain = Domain::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'dominio' => "required|string|max:255|unique:domains,dominio,{$id}",
            'cliente' => 'required|string|max:255',
            'ativo' => 'boolean',
            'data_registro' => 'required|date',
            'data_expiracao' => 'required|date|after_or_equal:data_registro',
            'observacoes' => 'nullable|string',
        ]);

        $domain->update($validated);

        return response()->json($domain, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $domain = Domain::findOrFail($id);
        $domain->delete();

        return response()->json(['message' => 'Domínio deletado com sucesso.'], 200);
    }
}
