import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import JiHoonChat from './components/JiHoonChat';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifica login ao carregar
  useEffect(() => {
     const logged = localStorage.getItem('lyaflix_logged');
     if(logged === 'true') setIsLoggedIn(true);
  }, []);

  const handleLogin = (status) => {
      if(status) {
          localStorage.setItem('lyaflix_logged', 'true');
          setIsLoggedIn(true);
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('lyaflix_logged');
      setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Home onLogout={handleLogout} />
      <JiHoonChat />
    </>
  );
}

export default App;
