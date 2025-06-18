import React from 'react';
import { callFn } from '@/utils/path/to/str';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>callFn {callFn()}</h3>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit 3<code>src/App.tsx</code> and save to reload hel-mono.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
