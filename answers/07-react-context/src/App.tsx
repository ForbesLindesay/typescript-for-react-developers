import React from 'react';
import Counter from './Counter';
import './App.css';
import {CounterProvider} from './CounterStore';
import {CounterModeProvider} from './CounterMode';

const App: React.FC = () => {
  return (
    <CounterProvider initialCount={0}>
      <div className="App">
        <header className="App-header">
          <h1>Arabic</h1>
          <Counter />
          <h1>Roman</h1>
          <CounterModeProvider mode="ROMAN">
            <Counter />
          </CounterModeProvider>
        </header>
      </div>
    </CounterProvider>
  );
};

export default App;
