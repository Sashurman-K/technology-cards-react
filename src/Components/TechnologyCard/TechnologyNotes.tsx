import './TechnologyNotes.css'

function TechnologyNotes({ notes, onNotesChange, techId }: any) {
    const handleTextareaClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Останавливаем всплытие
    }


    return (
        <div className="notes-section">
            <h4>Мои заметки:</h4>
            <textarea
                value={notes}
                onClick={handleTextareaClick}
                onMouseDown={handleTextareaClick}
                onChange={(e) => onNotesChange(techId, e.target.value)}
                placeholder="Записывайте сюда важные моменты..."
                rows={3}
            />
            <div className="notes-hint">
                {notes.length > 0 ? `Заметка сохранена (${notes.length} символов)` :
                    'Добавьте заметку'}
            </div>
        </div>
    );
}

export default TechnologyNotes