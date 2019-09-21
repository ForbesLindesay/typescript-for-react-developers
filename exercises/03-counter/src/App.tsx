import React from 'react';
import Counter from './Counter';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Counter />
      </header>
    </div>
  );
};

export default App;
