import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import * as actions from './managerActions';
import { FEATURES } from '../../pages/profile/overview/const';

const emptyArr = Object.values(FEATURES.NAMES).map((x) => ({ x, y: null }));
const initialData = [emptyArr, emptyArr];

const satisfiedClients = handleActions(
  {
    [actions.getSatisfiedClients.SUCCESS](state, { payload }) {
      return payload;
    }
  },
  null
);

const grades = handleActions(
  {
    [actions.getRadarScores.SUCCESS](state, { payload }) {
      return payload || initialData;
    }
  },
  initialData
);

const managerReducer = combineReducers({
  grades,
  satisfiedClients
});

export default managerReducer;
