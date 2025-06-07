import { useEffect, useState } from 'react';

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    dominio: '',
    cliente: '',
    ativo: false,
    data_registro: '',
    data_expiracao: '',
    observacoes: '',
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function openEditForm(domain) {
    setIsEditMode(true);
    setEditingId(domain.id);
    setFormData({
      nome: domain.nome,
      dominio: domain.dominio,
      cliente: domain.cliente,
      ativo: domain.ativo,
      data_registro: domain.data_registro.split('T')[0],
      data_expiracao: domain.data_expiracao.split('T')[0],
      observacoes: domain.observacoes || '',
    });
    setShowForm(true);
  }

  function openCreateForm() {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      nome: '',
      dominio: '',
      cliente: '',
      ativo: false,
      data_registro: '',
      data_expiracao: '',
      observacoes: '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const url = isEditMode
      ? `http://localhost:8000/api/domains/${editingId}`
      : 'http://localhost:8000/api/domains';

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
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
          setError(Object.values(data.errors).flat().join(' '));
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Erro ao salvar domínio');
        }
        return;
      }

      setShowForm(false);
      fetchDomains();
    } catch {
      setError('Erro ao conectar com o servidor');
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
    window.location.href = '/login';
  }

  if (loading) return <p>Carregando domínios...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Domínios</h1>

      <button
        onClick={openCreateForm}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Novo Domínio
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 border rounded space-y-4 bg-gray-50"
        >
          <div>
            <label className="block mb-1">Nome</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Domínio</label>
            <input
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Cliente</label>
            <input
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="ativo"
              name="ativo"
              type="checkbox"
              checked={formData.ativo}
              onChange={handleChange}
            />
            <label htmlFor="ativo">Ativo</label>
          </div>
          <div>
            <label className="block mb-1">Data Registro</label>
            <input
              type="date"
              name="data_registro"
              value={formData.data_registro}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Data Expiração</label>
            <input
              type="date"
              name="data_expiracao"
              value={formData.data_expiracao}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isEditMode ? 'Salvar' : 'Criar'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}

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
                  onClick={() => openEditForm(domain)}
                  className="flex items-center space-x-1 px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                  title="Alterar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5h2M10 11h4m-2 7h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H8l-4 4v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Alterar</span>
                </button>

                <button
                  onClick={() => handleDelete(domain.id)}
                  className="flex items-center space-x-1 px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                  title="Excluir"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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

      {/* Botão "Voltar para Login" abaixo da tabela, à direita */}
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
