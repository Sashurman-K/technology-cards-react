import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение базовых компонентов',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript',
        status: 'completed',
        notes: '',
        category: 'backend'
    },
];

export const useTechnologies = () => {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    const updateStatus = (techId: number, newStatus: string) => {
        setTechnologies((prev : any) =>
            prev.map((tech : any) =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    const updateNotes = (techId: number, newNotes: string) => {
        setTechnologies((prev : any) =>
            prev.map((tech : any) =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    const updateAllStatuses = (status: string) => {
        setTechnologies((prev : any)=>
            prev.map((tech : any) => ({ ...tech, status }))
        );
    };

    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter((tech : any) =>
            tech.status === 'completed'
        ).length;
        return Math.round((completed / technologies.length) * 100);
    };

    return {
        technologies,
        setTechnologies,
        updateStatus,
        updateNotes,
        updateAllStatuses,
        progress: calculateProgress()
    };
};

export default useTechnologies;