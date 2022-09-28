import React from 'react';
import './App.css';
import logo from './logo.svg';

interface IProps {
  onHeaderClick?: (label: string) => void;
}

const App = React.forwardRef(function App(props: IProps, ref: any) {
  console.log('hi ref', ref);

  React.useImperativeHandle(ref, () => ({
    sayHello() {
      alert('Hello hel-micro remote comp (ts)');
    },
  }));
  return (
    <div className="App">
      <header className="App-header" onClick={() => props.onHeaderClick?.('header click')}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <h1>This is a hel remote react component (ts) v2</h1>
          <h2>emitted by hel-micro</h2>
        </p>
        <a className="App-link" href="https://tnfe.github.io/hel" target="_blank" rel="noopener noreferrer">
          Learn hel-micro
        </a>
      </header>
    </div>
  );
});

export default App;
