import * as computed from './computed';
import * as reducer from './reducer';
import state from './state';

export default {
  state,
  reducer,
  computed,
  lifecycle: {
    loaded(dispatch) {
      dispatch(reducer.initClassInfoList);
    },
  },
};
