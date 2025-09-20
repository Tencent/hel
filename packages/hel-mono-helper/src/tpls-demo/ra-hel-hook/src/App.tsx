import React from 'react';
import { hello } from '@hel-demo/mono-bslib';
import { callFn } from '@/utils/path/to/str';
import logo from './logo.svg';
import './App.css';
import styles from './App.module.css';
import pkg from '../package.json';

function App() {
  const [greetLabel] = React.useState(hello());
  console.log(pkg);

  return (
    <div className="App">
      <header className="App-header">
        <h3 className={styles.wrap}>{callFn()}</h3>
        <h3 className={styles.wrap}>@hel-demo/mono-bslib: {greetLabel}</h3>
        <pre style={{ fontSize: '19px' }}>
          run 'pnpm start {pkg.name}:hel', @hel-demo/mono-bslib will come from cdn
          <br />
          run 'pnpm start {pkg.name}:raw', @hel-demo/mono-bslib will come from node_modules
        </pre>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload hel-mono react.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <a className="App-link" href="https://github.com/Tencent/hel" target="_blank" rel="noopener noreferrer">
          Learn Hel-micro
        </a>
      </header>
    </div>
  );
}

export default App;
