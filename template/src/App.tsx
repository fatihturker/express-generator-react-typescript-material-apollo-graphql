import React from 'react';
import './App.css';
import UsersPage from './components/UsersPage';
import AppHeaderPage from './components/AppHeaderPage';

/**
 * @description holds app instance
 */

const App: React.FC = () => {
  return (
    <div className="App">
      <AppHeaderPage />
      <UsersPage />
    </div>
  );
}

export default App;
