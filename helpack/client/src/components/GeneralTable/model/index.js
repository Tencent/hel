import { configure } from 'concent';
import * as reducer from './reducer';
import state from './state';

configure('GeneralTable', {
  state,
  reducer,
});
