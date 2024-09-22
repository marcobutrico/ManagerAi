'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TypeUsers() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
  const [novoTipo, setNovoTipo] = useState({
    tipo: ''
  });

  useEffect(() => {
    fetchTipos();
  }, [search]);

  // Função para buscar tipos de usuário
  const fetchTipos = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('tipo')
      .select('*')
      .ilike('tipo', `%${search}%`) // Busca por tipo
      .order('tipo', { ascending: true });

    if (error) console.error('Erro ao buscar tipos de usuários:', error);
    else setTipos(data);
    setLoading(false);
  };

  // Função para adicionar novo tipo de usuário
  const adicionarTipo = async () => {
    const { data, error } = await supabase.from('tipo').insert([novoTipo]);

    if (error) {
      console.error('Erro ao adicionar tipo de usuário:', error);
    } else {
      setIsModalOpen(false); // Fecha o modal após inclusão
      fetchTipos(); // Atualiza a lista de tipos de usuários
    }
  };

  return (
    <div className="bg-white rounded-lg mx-3 p-4">
      <h1 className="text-2xl font-bold my-4">Tipos de Usuário</h1>

      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por tipo de usuário..."
          className="border rounded px-4 py-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Botão de adicionar novo tipo */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)} // Abre o modal
        >
          Adicionar Novo Tipo de Usuário
        </button>
      </div>

      {/* Tabela de tipos de usuário */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {tipos.length === 0 ? (
              <tr>
                <td colSpan="1" className="text-center px-4 py-2">
                  Nenhum tipo de usuário encontrado
                </td>
              </tr>
            ) : (
              tipos.map((tipo) => (
                <tr key={tipo.uuid}>
                  <td className="border px-4 py-2">{tipo.tipo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal para adicionar novo tipo de usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Tipo de Usuário</h2>

            {/* Campo para o novo tipo */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tipo de Usuário"
                className="border rounded px-4 py-2 w-full"
                value={novoTipo.tipo}
                onChange={(e) =>
                  setNovoTipo({ ...novoTipo, tipo: e.target.value })
                }
              />
            </div>

            {/* Botões do modal */}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setIsModalOpen(false)} // Fecha o modal
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={adicionarTipo}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
