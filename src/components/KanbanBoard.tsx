import { useState } from 'react';
import BoardSidebar from './BoardSidebar';
import KanbanColumn from './KanbanColumn';
import CardFormModal from './CardFormModal';

type Board = {
  id: string;
  title: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  boardId: string;
};

const KanbanBoard = () => {
  const [boards, setBoards] = useState<Board[]>([
    { id: '1', title: 'Lanzamiento del Proyecto' },
    { id: '2', title: 'Plan de Marketing' },
  ]);

  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      title: 'Diseñar Página Principal',
      description: 'Crear wireframes y diseño final para la página principal',
      status: 'todo',
      boardId: '1',
    },
    {
      id: '2',
      title: 'Integración API',
      description: 'Conectar frontend con servicios backend',
      status: 'in-progress',
      boardId: '1',
    },
    {
      id: '3',
      title: 'Campaña Redes Sociales',
      description: 'Planear y programar publicaciones para el lanzamiento',
      status: 'todo',
      boardId: '2',
    },
  ]);

  const [selectedBoard, setSelectedBoard] = useState<string>('1');
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [cardFormData, setCardFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Card['status']
  });

  const filteredCards = cards.filter((card) => card.boardId === selectedBoard);

  const openCardForm = (status: Card['status']) => {
    setCardFormData({
      title: '',
      description: '',
      status
    });
    setEditingCard(null);
    setShowCardForm(true);
  };

  const openEditForm = (card: Card) => {
    setCardFormData({
      title: card.title,
      description: card.description,
      status: card.status
    });
    setEditingCard(card);
    setShowCardForm(true);
  };

  const handleCardFormSubmit = (cardData: Omit<Card, 'id' | 'boardId'>) => {
    if (editingCard) {
      setCards(cards.map(card => 
        card.id === editingCard.id ? { ...card, ...cardData } : card
      ));
    } else {
      const newCard = {
        id: Date.now().toString(),
        ...cardData,
        boardId: selectedBoard,
      };
      setCards([...cards, newCard]);
    }
    setShowCardForm(false);
  };

  const moveCard = (cardId: string, newStatus: Card['status']) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, status: newStatus } : card
      )
    );
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const addBoard = (title: string) => {
    setBoards([...boards, { id: Date.now().toString(), title }]);
  };

  const editBoard = (id: string, newTitle: string) => {
    setBoards(boards.map(board => 
      board.id === id ? { ...board, title: newTitle } : board
    ));
  };

  const deleteBoard = (id: string) => {
    setBoards(boards.filter(board => board.id !== id));
    setCards(cards.filter(card => card.boardId !== id));
    if (selectedBoard === id) {
      setSelectedBoard(boards.length > 1 ? boards[0].id : '');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CardFormModal
        isOpen={showCardForm}
        onClose={() => setShowCardForm(false)}
        onSubmit={handleCardFormSubmit}
        initialData={cardFormData}
        isEditing={!!editingCard}
      />

      <BoardSidebar
        boards={boards}
        selectedBoard={selectedBoard}
        onSelectBoard={setSelectedBoard}
        onAddBoard={addBoard}
        onEditBoard={editBoard}
        onDeleteBoard={deleteBoard}
      />

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {boards.find((b) => b.id === selectedBoard)?.title || 'Tablero'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn
            title="Por Hacer"
            status="todo"
            cards={filteredCards.filter(card => card.status === 'todo')}
            onAddCard={() => openCardForm('todo')}
            onEditCard={openEditForm}
            onMoveCard={moveCard}
            onDeleteCard={deleteCard}
          />

          <KanbanColumn
            title="En Progreso"
            status="in-progress"
            cards={filteredCards.filter(card => card.status === 'in-progress')}
            onAddCard={() => openCardForm('in-progress')}
            onEditCard={openEditForm}
            onMoveCard={moveCard}
            onDeleteCard={deleteCard}
          />

          <KanbanColumn
            title="Completado"
            status="done"
            cards={filteredCards.filter(card => card.status === 'done')}
            onAddCard={() => openCardForm('done')}
            onEditCard={openEditForm}
            onMoveCard={moveCard}
            onDeleteCard={deleteCard}
          />
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
