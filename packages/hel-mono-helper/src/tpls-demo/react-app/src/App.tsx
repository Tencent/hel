import { callFn } from '@/utils/path/to/str';
import './App.css';
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>{callFn()}</h3>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload hel-mono react.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <a className="Hel-micro-link" href="https://github.com/Tencent/hel" target="_blank" rel="noopener noreferrer">
          Learn Hel-micro
        </a>
      </header>
    </div>
  );
}

export default App;
