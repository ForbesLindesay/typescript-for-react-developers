import React from 'react';
import Button from './Button';
import './App.css';

const App: React.FC = () => {
  const buttonRef = React.useRef<HTMLElement>(null);
  const linkRef = React.useRef<HTMLElement>(null);
  const [state, setState] = React.useState<'button' | 'link'>('button');
  return (
    <div className="App">
      <header className="App-header">
        <Button ref={buttonRef} onClick={() => alert('clicked')}>
          I'm a button
        </Button>
        <Button ref={linkRef} href="http://example.com">
          I'm a link
        </Button>
        <button
          className="toggle-focus"
          type="button"
          onClick={() => {
            if (state === 'button') {
              buttonRef.current?.focus();
              setState('link');
            } else {
              linkRef.current?.focus();
              setState('button');
            }
          }}
        >
          Toggle Focus
        </button>
      </header>
    </div>
  );
};

export default App;
