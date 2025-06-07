import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDomains();
  }, [token]);

  async function fetchDomains() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/domains', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Falha ao carregar domínios');

      const data = await res.json();
      setDomains(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir este domínio?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/domains/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Erro ao deletar domínio');
      fetchDomains();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  if (loading) return <p>Carregando domínios...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Domínios</h1>

      <button
        onClick={() => router.push('/domainsRegister')}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Novo Domínio
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Nome</th>
            <th className="border border-gray-300 p-2">Domínio</th>
            <th className="border border-gray-300 p-2">Cliente</th>
            <th className="border border-gray-300 p-2">Ativo</th>
            <th className="border border-gray-300 p-2">Data Registro</th>
            <th className="border border-gray-300 p-2">Data Expiração</th>
            <th className="border border-gray-300 p-2">Observações</th>
            <th className="border border-gray-300 p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain) => (
            <tr key={domain.id}>
              <td className="border border-gray-300 p-2">{domain.nome}</td>
              <td className="border border-gray-300 p-2">{domain.dominio}</td>
              <td className="border border-gray-300 p-2">{domain.cliente}</td>
              <td className="border border-gray-300 p-2">{domain.ativo ? 'Sim' : 'Não'}</td>
              <td className="border border-gray-300 p-2">{new Date(domain.data_registro).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2">{new Date(domain.data_expiracao).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2">{domain.observacoes}</td>
              <td className="border border-gray-300 p-2 flex space-x-3 justify-center">
                <button
                  onClick={() => router.push(`/domainsEdit?id=${domain.id}`)}
                  className="flex items-center space-x-1 px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                  title="Alterar"
                >
                  <span className="text-sm font-medium">Alterar</span>
                </button>

                <button
                  onClick={() => handleDelete(domain.id)}
                  className="flex items-center space-x-1 px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                  title="Excluir"
                >
                  <span className="text-sm font-medium">Excluir</span>
                </button>
              </td>
            </tr>
          ))}
          {domains.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-4 text-gray-500">
                Nenhum domínio encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Voltar para Login
        </button>
      </div>
    </div>
  );
}
