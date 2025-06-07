// pages/domainsRegister.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DomainsRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    dominio: '',
    cliente: '',
    ativo: false,
    data_registro: '',
    data_expiracao: '',
    observacoes: '',
  });

  const [error, setError] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/api/domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat().join(' ');
          throw new Error(allErrors);
        } else {
          throw new Error('Erro ao cadastrar domínio.');
        }
      }

      router.push('/domains');
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Domínio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required className="w-full border p-2 rounded" />
        <input name="dominio" value={formData.dominio} onChange={handleChange} placeholder="Domínio" required className="w-full border p-2 rounded" />
        <input name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Cliente" required className="w-full border p-2 rounded" />
        <input type="date" name="data_registro" value={formData.data_registro} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="date" name="data_expiracao" value={formData.data_expiracao} onChange={handleChange} required className="w-full border p-2 rounded" />
        <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações" className="w-full border p-2 rounded" />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} />
          <span>Ativo</span>
        </label>

        <div className="flex space-x-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Criar</button>
          <button type="button" onClick={() => router.push('/domains')} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
