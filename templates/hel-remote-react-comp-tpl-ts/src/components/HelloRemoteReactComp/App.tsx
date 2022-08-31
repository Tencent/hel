import React from 'react';
import logo from './logo.svg';
import './App.css';

interface IProps {
  onHeaderClick?: (label: string) => void;
}


const App = React.forwardRef(function App(props: IProps, ref: any) {
  console.log('hi ref', ref);

  React.useImperativeHandle(ref, () => ({
    sayHello() {
      alert('Hello');
    }
  }));
  return (
    <div className="App">
      <header className="App-header" onClick={() => props.onHeaderClick?.('header click')}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <h1>This is a hel remote react component (ts)</h1>
          <h2>emitted by hel-micro</h2>
        </p>
        <a
          className="App-link"
          href="https://www.baidu.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn hel-micro
        </a>
      </header>
    </div>
  );
})

export default App;
