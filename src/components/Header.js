import React from 'react';

const Header = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <a href="/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l6-3.5-6-3.5z"/>
            </svg>
            NextSakura
          </a>
        </div>
        <ul className="nav-links">
          <li><a href="/">Início</a></li>
          <li><a href="/projetos">Projetos</a></li>
          <li><a href="/categorias">Categorias</a></li>
          <li><a href="/ranking">Ranking</a></li>
        </ul>
        <div className="search-bar">
          <input type="text" placeholder="Pesquisar..." />
          <button className="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
        <div className="user-options">
          <a href="/login" className="login-btn">Entrar</a>
          <a href="/cadastro" className="register-btn">Cadastrar</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;