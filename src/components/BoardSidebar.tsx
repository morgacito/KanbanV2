import { Plus, X, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Board = {
  id: string;
  title: string;
};

type BoardSidebarProps = {
  boards: Board[];
  selectedBoard: string;
  onSelectBoard: (id: string) => void;
  onAddBoard: (title: string) => void;
  onEditBoard: (id: string, newTitle: string) => void;
  onDeleteBoard: (id: string) => void;
};

const BoardSidebar = ({ 
  boards, 
  selectedBoard, 
  onSelectBoard, 
  onAddBoard,
  onEditBoard,
  onDeleteBoard
}: BoardSidebarProps) => {
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [showMenuForBoard, setShowMenuForBoard] = useState<string | null>(null);
  const menuRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenuForBoard && menuRefs.current[showMenuForBoard] && 
          !menuRefs.current[showMenuForBoard]?.contains(e.target as Node)) {
        setShowMenuForBoard(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenuForBoard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      if (editingBoardId) {
        onEditBoard(editingBoardId, newBoardTitle);
        setEditingBoardId(null);
      } else {
        onAddBoard(newBoardTitle);
      }
      setNewBoardTitle('');
      setShowBoardModal(false);
    }
  };

  const handleEditBoard = (board: Board) => {
    setNewBoardTitle(board.title);
    setEditingBoardId(board.id);
    setShowBoardModal(true);
    setShowMenuForBoard(null);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Tus Tableros</h2>
      <ul className="space-y-2">
        {boards.map((board) => (
          <li key={board.id} className="group relative">
            <div className="flex items-center">
              <button
                onClick={() => onSelectBoard(board.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedBoard === board.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {board.title}
              </button>
              <button
                onClick={() => setShowMenuForBoard(showMenuForBoard === board.id ? null : board.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 p-1 transition-opacity"
              >
                <MoreVertical size={16} />
              </button>
            </div>

            {showMenuForBoard === board.id && (
              <div 
                ref={el => menuRefs.current[board.id] = el}
                className="absolute right-0 mt-1 z-10 bg-white rounded-md shadow-lg"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleEditBoard(board)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit2 size={14} className="mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDeleteBoard(board.id);
                      setShowMenuForBoard(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          setEditingBoardId(null);
          setNewBoardTitle('');
          setShowBoardModal(true);
        }}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        <Plus size={16} />
        Nuevo Tablero
      </button>

      {showBoardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingBoardId ? 'Editar Tablero' : 'Agregar Nuevo Tablero'}
              </h3>
              <button 
                onClick={() => setShowBoardModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Tablero
                </label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBoardModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {editingBoardId ? 'Guardar Cambios' : 'Agregar Tablero'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardSidebar;
