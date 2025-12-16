import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Добавляем useEffect
import Home from './pages/Home';
import Login from './pages/Login/Login';
import TechnologyList from './pages/TechnologyList/TechonologyList';
import { CountriesPage } from './pages/CountryPages/CountryPage';
import TechnologyDetail from './pages/TechnologyDetail/TechnologyDetail';
import Statistics from './pages/Statistics/Statistics';
import Settings from './pages/Settings/Settings';
import ProtectedRoute from './Components/ProtectedRoute';
import './App.css';
import AddTechnology from './pages/AddTechnology/AddTecnology';
function App() {
    // Состояние для отслеживания авторизации
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    // Проверяем авторизацию при загрузке и при изменении
    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = localStorage.getItem('username') || '';
        setIsLoggedIn(loggedIn);
        setUsername(user);
    }, []);
    const handleLogin = (user : any) => {
        setIsLoggedIn(true);
        setUsername(user);
    };
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
    };
    return (
        <Router>
            <div className="app">
                <nav className="main-nav">
                    <h2>Трекер технологий</h2>
                    <ul className="nav-links">
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/countries">Страны (Работа с API)</Link></li>

                        {isLoggedIn ? (
                            <>
                                <li><Link to="/technologies">Все технологии</Link></li>
                                <li><Link to="/statistics">Статистика</Link></li>
                                <li><Link to="/add-technology">Добавить технологию</Link></li>
                                <li><Link to="/settings">Настройки</Link></li>

                                <li className="user-info">
                                    <span>Привет, {username}!</span>
                                    <button onClick={handleLogout} className="logout-btn">
                                        Выйти
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li><Link to="/login">Войти</Link></li>
                        )}
                    </ul>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={<Login onLogin={handleLogin} />}
                        />

                        <Route
                            path="/technologies"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <TechnologyList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/technology/:techId"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <TechnologyDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/statistics'
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <Statistics />
                                </ProtectedRoute>
                            }/>
                        <Route
                            path='/add-technology'
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <AddTechnology />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/countries" element={
                            <CountriesPage />}
                            />
                        <Route
                            path='/settings'
                            element={
                                <Settings />
                            }
                        />
                    </Routes>
                    {/* Динамический маршрут для пользователей */}

                </main>
            </div>
        </Router>
    );
}
export default App;
