// @ts-nocheck
import ReactDOM from 'react-dom';
import * as modules from './modules';

function getHostNode(id = 'root') {
  let node = document.getElementById(id);
  if (!node) {
    node = document.createElement('div');
    node.id = id;
    document.body.appendChild(node);
  }
  return node;
}

const { REACT_APP_COMP_TYPE = 'HelloMono' } = process.env;
const Comp = modules[REACT_APP_COMP_TYPE] || (() => <h1>comp {REACT_APP_COMP_TYPE} not defined</h1>);

ReactDOM.render(<Comp />, getHostNode('root'));
