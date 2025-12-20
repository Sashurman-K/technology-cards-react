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
    {
    id: 3,
    title: "TypeScript 6.0",
    description: "Освоение новых функций TypeScript 6.0, включая улучшенный вывод типов и новые утилиты для работы с типами.",
    status: "in-progress" as const,
    category: "frontend",
    notes: "Ресурсы: документация TypeScript, курс от Марио, практика на Codewars",
    createdAt: "2024-02-01T14:20:00.000Z",
    deadline: "2026-01-01T23:59:59.999Z"
  },
  {
    id: 4,
    title: "Docker и Kubernetes",
    description: "Полное погружение в контейнеризацию и оркестрацию контейнеров для продакшн окружений.",
    status: "not-started" as const,
    category: "devops",
    notes: "План: 1. Основы Docker, 2. Docker Compose, 3. Kubernetes basics, 4. Helm charts",
    createdAt: "2024-01-20T09:15:00.000Z",
    deadline: "2025-06-30T23:59:59.999Z"
  }
];

export const useTechnologies = () => {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    const updateStatus = (techId: number, newStatus?: string) => {
    setTechnologies((prev: any) =>
        prev.map((tech: any) => {
            if (tech.id === techId) {
                if (newStatus) {
                    return { ...tech, status: newStatus };
                }                const statusOrder = ['not-started', 'in-progress', 'completed'];
                const currentIndex = statusOrder.indexOf(tech.status);
                const nextIndex = (currentIndex + 1) % statusOrder.length;
                return { ...tech, status: statusOrder[nextIndex] };
            }
            return tech;
        })
    );
};

    const updateMultipleStatuses = (techIds: number[], newStatus: string) => {
        setTechnologies((prev : any) =>
            prev.map((tech : any) =>
                techIds.includes(tech.id) ? { ...tech, status: newStatus } : tech
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
        updateMultipleStatuses,
        updateNotes,
        updateAllStatuses,
        progress: calculateProgress()
    };
};

export default useTechnologies;