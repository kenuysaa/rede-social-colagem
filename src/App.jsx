import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage';  // Página de Login
import PostPage from './pages/postPage';    // Página de Feed + Criar Postagem
import ProfilePage from './pages/profilePage';  // Página de Perfil

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<loginPage />} />  {/* Tela de Login */}
        <Route path="/feed" element={<postPage />} />  {/* Tela de Feed + Criar Postagem */}
        <Route path="/profile" element={<profilePage />} />  {/* Tela de Perfil */}
      </Routes>
    </Router>
  );
};

export default App;
