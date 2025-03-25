import { Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Card } from './KanbanBoard';

type KanbanColumnProps = {
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  cards: Card[];
  onAddCard: () => void;
  onEditCard: (card: Card) => void;
  onMoveCard: (cardId: string, newStatus: 'todo' | 'in-progress' | 'done') => void;
  onDeleteCard: (cardId: string) => void;
};

const KanbanColumn = ({ 
  title, 
  status, 
  cards, 
  onAddCard, 
  onEditCard, 
  onMoveCard, 
  onDeleteCard 
}: KanbanColumnProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenu && menuRefs.current[activeMenu] && 
          !menuRefs.current[activeMenu]?.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    onMoveCard(cardId, status);
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const toggleMenu = (cardId: string) => {
    setActiveMenu(activeMenu === cardId ? null : cardId);
  };

  const getColumnColor = () => {
    switch (status) {
      case 'todo': return 'bg-gray-50 border-gray-200';
      case 'in-progress': return 'bg-blue-50 border-blue-100';
      case 'done': return 'bg-green-50 border-green-100';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <button
          onClick={onAddCard}
          className="text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => handleDragStart(e, card.id)}
            className={`${getColumnColor()} border rounded-lg p-4 hover:shadow-md transition-shadow cursor-move relative`}
          >
            <div className="flex justify-between">
              <h4 className="font-medium text-gray-800">{card.title}</h4>
              <div className="relative">
                <button 
                  onClick={() => toggleMenu(card.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical size={16} />
                </button>
                {activeMenu === card.id && (
                  <div 
                    ref={el => menuRefs.current[card.id] = el}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onEditCard(card);
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit2 size={14} className="inline mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          onDeleteCard(card.id);
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 size={14} className="inline mr-2" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {card.description}
            </p>
            <div className="mt-3 flex gap-2">
              {status === 'todo' && (
                <button
                  onClick={() => onMoveCard(card.id, 'in-progress')}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors"
                >
                  Comenzar
                </button>
              )}
              {status === 'in-progress' && (
                <>
                  <button
                    onClick={() => onMoveCard(card.id, 'todo')}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => onMoveCard(card.id, 'done')}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                  >
                    Completar
                  </button>
                </>
              )}
              {status === 'done' && (
                <>
                  <button
                    onClick={() => onMoveCard(card.id, 'in-progress')}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    Reabrir
                  </button>
                  <button 
                    onClick={() => onDeleteCard(card.id)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
