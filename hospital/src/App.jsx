import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'
  const [hospitalUser, setHospitalUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setHospitalUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setHospitalUser(null);
    setView('login');
  };

  return (
    <div>
      <header>
        <h1>Panacea Hospital Portal</h1>
      </header>
      
      <div className="container">
        {view === 'login' && (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToRegister={() => setView('register')} 
          />
        )}
        
        {view === 'register' && (
          <Register 
            onSwitchToLogin={() => setView('login')} 
          />
        )}
        
        {view === 'dashboard' && hospitalUser && (
          <Dashboard 
            hospital={hospitalUser} 
            onLogout={handleLogout} 
          />
        )}
      </div>
    </div>
  );
}

export default App;