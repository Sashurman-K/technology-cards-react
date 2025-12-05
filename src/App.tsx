import { useState } from 'react'
import './App.css'
import TechnologyCard from './Components/TechnologyCard'
import ProgressHeader from './Components/ProgressHeader'
import QuickButtons from './Components/QuickButtons'



interface TechnologyCardType {
  id: number;
  title: string;
  description: string;
  status: "not-completed" | "in-progress" | "completed";
}



function App() {

  const [technologies, setTechnologies] = useState([{
    id: 1, title: 'React Components', description: 'Изучение базовых компонентов',
    status: 'completed'
  },
  {
    id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status:
      'in-progress'
  },
  { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-completed' }
  ]);
  const [filter, setFilter] = useState('all');

  const getDisplayTech = () => {
    if (filter === 'all') {
      return technologies;
    }
    return technologies.filter(item => item.status === filter);
  }
  const updateFilter = () => {
    switch(filter){
      case 'all':
        setFilter('not-completed');
        break;
      case 'not-completed':
        setFilter('in-progress');
        break;
      case 'in-progress':
        setFilter('completed');
        break;
      case 'completed':
        setFilter('all');
        break;
      default:
        throw new Error('Неверное значение фильтра');
    }
  }
  const updateCardStatus = (cardId: number, newStatus: string) => {
    setTechnologies(prevCard =>
      prevCard.map(item =>
        item.id === cardId ?
          { ...item, status: newStatus } :
          item
      )
    );
  }
  const updateRandomCardStatus = () => {
    try {
      const notComplitedCards = technologies.filter(item => item.status === "not-completed");
      if (notComplitedCards.length === 0) {
        throw new Error('Нет не начатых задач');
      }
      const randomId = notComplitedCards[Math.floor(Math.random() * notComplitedCards.length)].id;
      setTechnologies(prevCard =>
        prevCard.map(item =>
          item.id === randomId ?
            { ...item, status: "in-progress" } :
            item
        )
      )
    }
    catch (error: any) {
      alert(`${error}`);
    }

  }

  const updateAllCardsStatus = (newStatus: string) => {
    setTechnologies(prevCard =>
      prevCard.map(item =>
        ({ ...item, status: newStatus })
      )
    );
  }


  return (
    <div>
      <ProgressHeader technologies={technologies} />
      <QuickButtons
        onChangeTechnologesState={updateAllCardsStatus}
        onUpdateRandomCard={updateRandomCardStatus}
        onUpdateFilter={updateFilter}
        filterValue={filter}/>
      {
        getDisplayTech().map(tech => (
          <TechnologyCard
            key={tech.id}
            id={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
            onChangeTechnologeType={updateCardStatus}
          />
        ))
      }
    </div>
  )
}

export default App
