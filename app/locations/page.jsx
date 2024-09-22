'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Localizacoes() {
  const [localizacoes, setLocalizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
  const [novaLocalizacao, setNovaLocalizacao] = useState({
    nomelocalizacao: '',
    endereco: '',
    fotodolocal: '',
    coordenadas: '',
  });

  useEffect(() => {
    fetchLocalizacoes();
  }, [search]);

  // Função para buscar localizações
  const fetchLocalizacoes = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('localizacoes')
      .select('*')
      .ilike('nomelocalizacao', `%${search}%`) // Busca por nome de localização
      .order('nomelocalizacao', { ascending: true });

    if (error) console.error('Erro ao buscar localizações:', error);
    else setLocalizacoes(data);
    setLoading(false);
  };

  // Função para adicionar nova localização
  const adicionarLocalizacao = async () => {
    const { data, error } = await supabase.from('localizacoes').insert([novaLocalizacao]);

    if (error) {
      console.error('Erro ao adicionar localização:', error);
    } else {
      setIsModalOpen(false); // Fecha o modal após inclusão
      fetchLocalizacoes(); // Atualiza a lista de localizações
    }
  };

  return (
    <div className="bg-white rounded-lg mx-3 p-4">
      <h1 className="text-2xl font-bold my-4">Localizações</h1>

      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome de localização..."
          className="border rounded px-4 py-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Botão de adicionar nova localização */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)} // Abre o modal
        >
          Adicionar Nova Localização
        </button>
      </div>

      {/* Tabela de localizações */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Foto</th>
              <th className="border px-4 py-2">Nome</th>
              <th className="border px-4 py-2">Endereço</th>
              {/* <th className="border px-4 py-2">Coordenadas</th> */}
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {localizacoes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center px-4 py-2">
                  Nenhuma localização encontrada
                </td>
              </tr>
            ) : (
              localizacoes.map((localizacao) => (
                <tr key={localizacao.uuid}>
                  <td className="border px-4 py-2">
                    {localizacao.fotodolocal ? (
                      <img
                        src={localizacao.fotodolocal}
                        alt={localizacao.nomelocalizacao}
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      'Sem Foto'
                    )}
                  </td>
                  <td className="border px-4 py-2">{localizacao.nomelocalizacao}</td>
                  <td className="border px-4 py-2">{localizacao.endereco}</td>

{/*                   <td className="border px-4 py-2">
                    {localizacao.coordenadas}
                  </td> */}
                  <td className="border px-4 py-2">
                    {/* Botão de visualizar e editar */}
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
                      Visualizar
                    </button>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal de adicionar nova localização */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Nova Localização</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Nome da Localização"
                className="border rounded px-4 py-2 w-full"
                value={novaLocalizacao.nomelocalizacao}
                onChange={(e) =>
                  setNovaLocalizacao({ ...novaLocalizacao, nomelocalizacao: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Endereço"
                className="border rounded px-4 py-2 w-full"
                value={novaLocalizacao.endereco}
                onChange={(e) =>
                  setNovaLocalizacao({ ...novaLocalizacao, endereco: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="URL da Foto"
                className="border rounded px-4 py-2 w-full"
                value={novaLocalizacao.fotodolocal}
                onChange={(e) =>
                  setNovaLocalizacao({ ...novaLocalizacao, fotodolocal: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Coordenadas (latitude, longitude)"
                className="border rounded px-4 py-2 w-full"
                value={novaLocalizacao.coordenadas}
                onChange={(e) =>
                  setNovaLocalizacao({ ...novaLocalizacao, coordenadas: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setIsModalOpen(false)} // Fecha o modal
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={adicionarLocalizacao}
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
