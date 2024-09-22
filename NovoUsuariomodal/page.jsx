// components/NovoUsuarioModal.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NovoUsuarioModal({ isOpen, onClose, fetchUsuarios }) {
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    login: '',
    matricula: '',
    tipo_usuario: '',
    ativo: true,
  });
  const [tipos, setTipos] = useState([]);

  // Buscar os tipos de usuário da tabela 'tipo' ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetchTipos();
    }
  }, [isOpen]);

  const fetchTipos = async () => {
    const { data, error } = await supabase.from('tipo').select('*');
    if (error) {
      console.error('Erro ao buscar tipos de usuário:', error);
    } else {
      setTipos(data);
    }
  };

  // Função para adicionar novo usuário
  const adicionarUsuario = async () => {
    const { data, error } = await supabase.from('users').insert([novoUsuario]);

    if (error) {
      console.error('Erro ao adicionar usuário:', error);
    } else {
      onClose(); // Fecha o modal após inclusão
      fetchUsuarios(); // Atualiza a lista de usuários
    }
  };

  if (!isOpen) return null; // Não renderiza o modal se ele não estiver aberto

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Usuário</h2>

        {/* Campo Nome */}
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

        {/* Campo Login */}
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

        {/* Campo Matrícula */}
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

        {/* Seleção de Tipo de Usuário */}
        <div className="mb-4">
          <select
            className="border rounded px-4 py-2 w-full"
            value={novoUsuario.tipo_usuario}
            onChange={(e) =>
              setNovoUsuario({ ...novoUsuario, tipo_usuario: e.target.value })
            }
          >
            <option value="">Selecione o tipo de usuário</option>
            {tipos.map((tipo) => (
              <option key={tipo.uuid} value={tipo.uuid}>
                {tipo.tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox para Ativo */}
        <div className="mb-4 flex items-center">
          <label className="mr-2">Ativo</label>
          <input
            type="checkbox"
            checked={novoUsuario.ativo}
            onChange={() =>
              setNovoUsuario({ ...novoUsuario, ativo: !novoUsuario.ativo })
            }
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={adicionarUsuario}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
