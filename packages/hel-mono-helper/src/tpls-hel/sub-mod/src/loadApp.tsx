// @ts-nocheck
import ReactDOM from 'react-dom';
import { getHostNode } from 'hel-mono-runtime-helper';
import { APP_GROUP_NAME } from './configs/subApp';
import * as modules from './modules';

const { REACT_APP_COMP_TYPE = 'HelloMono' } = process.env;
const Comp = modules[REACT_APP_COMP_TYPE] || (() => <h1>developing {APP_GROUP_NAME}</h1>);

ReactDOM.render(<Comp />, getHostNode());
