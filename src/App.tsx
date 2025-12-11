import useAppLogic  from './Components/Hooks/useAppLogic';
import TechnologyCard from './Components/TechnologyCard/TechnologyCard';
import ProgressHeader from './Components/Progress/ProgressHeader';
import QuickButtons from './Components/QuickButtons/QuickButtons';

function App() {
    const {
        technologies,
        filteredTechnologies, // <-- Используем отфильтрованные технологии
        progress,
        filterValue,
        searchQuery,
        updateStatus,
        updateNotes,
        setSearchQuery,
        handleMassStatusUpdate,
        handleRandomTechnology,
        handleFilterChange
    } = useAppLogic();

    return (
        <div className="app">
            <header className="app-header">
                <h1>Трекер изучения технологий</h1>
                <ProgressHeader
                    technologies={technologies}
                />
                <QuickButtons
                    onChangeTechnologiesState={handleMassStatusUpdate}
                    onUpdateRandomCard={handleRandomTechnology}
                    onUpdateFilter={handleFilterChange}
                    filterValue={filterValue}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    filteredTechnologies={filteredTechnologies} // Передаем отфильтрованные
                />
            </header>
            <main className="app-main">
                <div className="technologies-grid">
                    {/* Отображаем отфильтрованные технологии */}
                    {filteredTechnologies.length > 0 ? (
                        filteredTechnologies.map(tech => (
                            <TechnologyCard
                                key={tech.id}
                                technology={tech}
                                onStatusChange={updateStatus}
                                onNotesChange={updateNotes}
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            {searchQuery ?
                                'Ничего не найдено по вашему запросу' :
                                'Нет технологий с выбранным статусом'}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;