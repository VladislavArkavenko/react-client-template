import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import * as actions from './opinionDetailsActions';
import { makeStatusWithResetReducer } from '../../utils/reduxHelpers';

const criteriaStatus = makeStatusWithResetReducer(
  actions.fetchOpinionDetails,
  actions.clearAll.TRIGGER
);

const criteriaData = handleActions(
  {
    [actions.fetchOpinionDetails.SUCCESS](state, { payload }) {
      return payload.data;
    },
    [actions.clearAll.TRIGGER]() {
      return {};
    }
  },
  {}
);

const criteria = combineReducers({
  status: criteriaStatus,
  data: criteriaData
});

const selectedCriteria = handleActions(
  {
    [actions.setProfile.SUCCESS](state, { payload }) {
      return payload.criteria;
    },
    [actions.clearAll.TRIGGER]() {
      return null;
    }
  },
  null
);

const selectedSubject = handleActions(
  {
    [actions.setProfile.SUCCESS](state, { payload }) {
      return payload.subject;
    },
    [actions.clearAll.TRIGGER]() {
      return null;
    }
  },
  null
);

const selectedTopic = handleActions(
  {
    [actions.setProfile.SUCCESS](state, { payload }) {
      return payload.topic;
    },
    [actions.clearAll.TRIGGER]() {
      return null;
    }
  },
  null
);

const comments = handleActions(
  {
    [actions.fetchOpinionDetails.SUCCESS](state, { payload }) {
      return payload.comments;
    },
    [actions.clearAll.TRIGGER]() {
      return [];
    }
  },
  []
);

const opinionDetails = combineReducers({
  criteria,
  comments,
  selectedCriteria,
  selectedSubject,
  selectedTopic
});

export default opinionDetails;
