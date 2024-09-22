'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal para adicionar
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Controle do modal de visualização
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controle do modal de edição
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    nomemeio: '',
    sobrenome: '',
    login: '',
    matricula: '',
    ativo: true,
    tipo_id: null,
  });
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); // Usuário selecionado para visualização/edição

  useEffect(() => {
    fetchUsuarios();
  }, [search]);

  // Função para buscar usuários com join na tabela de tipo de usuário
  const fetchUsuarios = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('users')
      .select(`
        login, nome, nomemeio, sobrenome,  matricula, ativo, 
        tipo (
          tipo
        )
      `)
      .ilike('nome', `%${search}%`) // Busca por nome
      .order('login', { ascending: true });

    if (error) console.error('Erro ao buscar usuários:', error);
    else setUsuarios(data);
    setLoading(false);
  };

  // Função para adicionar novo usuário
  const adicionarUsuario = async () => {
    const { data, error } = await supabase.from('users').insert([novoUsuario]);

    if (error) {
      console.error('Erro ao adicionar usuário:', error);
    } else {
      setIsModalOpen(false); // Fecha o modal após inclusão
      fetchUsuarios(); // Atualiza a lista de usuários
    }
  };

  // Função para abrir o modal de visualização
  const abrirVisualizacao = (usuario) => {
    setUsuarioSelecionado(usuario);
    setIsViewModalOpen(true);
  };

  // Função para abrir o modal de edição
  const abrirEdicao = (usuario) => {
    setUsuarioSelecionado(usuario);
    setIsEditModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg mx-3 p-4">
      <h1 className="text-2xl font-bold my-4">Usuários</h1>

      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="border rounded px-4 py-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Botão de adicionar novo usuário */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)} // Abre o modal de adição
        >
          Adicionar Novo Usuário
        </button>
      </div>

      {/* Tabela de usuários */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Login</th>
              <th className="border px-4 py-2">Nome</th>
              <th className="border px-4 py-2">Nome do Meio</th>
              <th className="border px-4 py-2">Sobrenome</th>
              <th className="border px-4 py-2">Matrícula</th>
              <th className="border px-4 py-2">Ativo</th>
              <th className="border px-4 py-2">Tipo de Usuário</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center px-4 py-2">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.uuid}>
                  <td className="border px-4 py-2">{usuario.login}</td>
                  <td className="border px-4 py-2">{usuario.nome}</td>
                  <td className="border px-4 py-2">{usuario.nomemeio}</td>
                  <td className="border px-4 py-2">{usuario.sobrenome}</td>
                  <td className="border px-4 py-2">{usuario.matricula}</td>
                  <td className="border px-4 py-2">
                    {usuario.ativo ? 'Sim' : 'Não'}
                  </td>
                  <td className="border px-4 py-2">{usuario.tipo.tipo}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                      onClick={() => abrirVisualizacao(usuario)}
                    >
                      Visualizar
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => abrirEdicao(usuario)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal de adicionar novo usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Usuário</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Nome"
                className="border rounded px-4 py-2 w-full"
                value={novoUsuario.nome}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, nome: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Nome do Meio"
                className="border rounded px-4 py-2 w-full"
                value={novoUsuario.nomemeio}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, nomemeio: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Sobrenome"
                className="border rounded px-4 py-2 w-full"
                value={novoUsuario.sobrenome}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, sobrenome: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Login"
                className="border rounded px-4 py-2 w-full"
                value={novoUsuario.login}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, login: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Matrícula"
                className="border rounded px-4 py-2 w-full"
                value={novoUsuario.matricula}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, matricula: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Tipo de Usuário</label>
              <select
                className="border rounded px-4 py-2 w-full"
                value={novoUsuario.tipo_id}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, tipo_id: e.target.value })
                }
              >
                <option value="">Selecione o tipo de usuário</option>
                {/* Adicionar aqui a lógica para listar os tipos de usuários */}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Ativo</label>
              <select
                className="border rounded px-4 py-2 w-full"
                value={novoUsuario.ativo}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, ativo: e.target.value })
                }
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              onClick={adicionarUsuario}
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}