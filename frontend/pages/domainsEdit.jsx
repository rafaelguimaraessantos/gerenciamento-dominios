import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DomainsEdit() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    nome: '',
    dominio: '',
    cliente: '',
    ativo: false,
    data_registro: '',
    data_expiracao: '',
    observacoes: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (id) {
      fetch(`http://localhost:8000/api/domains/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao carregar domínio');
          return res.json();
        })
        .then((data) => {
          const d = data.data;
          setFormData({
            nome: d.nome,
            dominio: d.dominio,
            cliente: d.cliente,
            ativo: d.ativo,
            data_registro: d.data_registro.split('T')[0],
            data_expiracao: d.data_expiracao.split('T')[0],
            observacoes: d.observacoes || '',
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/api/domains/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          throw new Error(Object.values(data.errors).flat().join(' '));
        } else if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Erro ao atualizar domínio.');
        }
      }

      router.push('/domains');
    } catch (err) {
      setError(err.message || 'Erro ao atualizar');
    }
  }

  if (loading) return <p className="text-center mt-6">Carregando dados...</p>;
  if (error) return <p className="text-red-600 text-center mt-6">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Domínio</h1>

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
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
          <button type="button" onClick={() => router.push('/domains')} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
