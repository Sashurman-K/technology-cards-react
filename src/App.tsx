import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './Components/Notification/NotificationProvider';
import { ThemeToggle } from './Components/ThemeToggle/ThemeToggle';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import TechnologyList from './pages/TechnologyList/TechnologyList';
import { CountriesPage } from './pages/CountryPages/CountryPage';
import TechnologyDetail from './pages/TechnologyDetail/TechnologyDetail';
import Statistics from './pages/Statistics/Statistics';
import Settings from './pages/Settings/Settings';
import ProtectedRoute from './Components/ProtectedRoute';
import AddTechnology from './pages/AddTechnology/AddTechnology';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(user);
  }, []);

  const handleLogin = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  // Компонент для кнопок навигации
  const NavButton = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const navigate = useNavigate();

    return (
      <Button
        color="inherit"
        onClick={() => navigate(to)}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {children}
      </Button>
    );
  };

  return (
    <ThemeProvider>
      <NotificationProvider>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar
              position="static"
              sx={{
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'inherit'
                }}>
                  📚 Трекер технологий
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NavButton to="/">Главная</NavButton>
                  <NavButton to="/countries">Страны</NavButton>

                  {isLoggedIn ? (
                    <>
                      <NavButton to="/technologies">Технологии</NavButton>
                      <NavButton to="/statistics">Статистика</NavButton>
                      <NavButton to="/add-technology">Добавить</NavButton>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {username}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleLogout}
                          sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                              borderColor: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          Выйти
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <NavButton to="/login">Войти</NavButton>
                  )}

                  <ThemeToggle />
                </Box>
              </Toolbar>
            </AppBar>

            <Container
              maxWidth="xl"
              sx={{
                flexGrow: 1,
                py: 3
              }}
            >
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
                  path="/statistics"
                  element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                      <Statistics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-technology"
                  element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                      <AddTechnology />
                    </ProtectedRoute>
                  }
                />
                <Route path="/countries" element={<CountriesPage />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Container>

            <Box
              component="footer"
              sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
              }}
            >
              <Container maxWidth="xl">
                <Typography variant="body2" color="text.secondary" align="center">
                  © {new Date().getFullYear()} Трекер технологий. Все права защищены.
                </Typography>
              </Container>
            </Box>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;