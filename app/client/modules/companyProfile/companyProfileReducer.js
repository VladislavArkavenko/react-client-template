import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import * as actions from './companyProfileActions';
import { makeStatusWithResetReducer } from '../../utils/reduxHelpers';

import { PROPS } from '../../components/widgets/radar/const';

const { emptyData } = PROPS;

const radarStatus = makeStatusWithResetReducer(actions.fetchRadarScores, actions.clearAll.TRIGGER);

const radarData = handleActions(
  {
    [actions.fetchRadarScores.SUCCESS](state, { payload }) {
      return payload || emptyData;
    },
    [actions.clearAll.TRIGGER]() {
      return emptyData;
    }
  },
  emptyData
);

const radar = combineReducers({
  status: radarStatus,
  data: radarData
});

const topScoresStatus = makeStatusWithResetReducer(
  actions.fetchTopScores,
  actions.clearAll.TRIGGER
);

const topScoresData = handleActions(
  {
    [actions.fetchTopScores.SUCCESS](state, { payload }) {
      return payload;
    },
    [actions.clearAll.TRIGGER]() {
      return [];
    }
  },
  []
);

const topScores = combineReducers({
  status: topScoresStatus,
  data: topScoresData
});

const statsStatus = makeStatusWithResetReducer(actions.fetchStatistics, actions.clearAll.TRIGGER);

const statsData = handleActions(
  {
    [actions.fetchStatistics.SUCCESS](state, { payload }) {
      return payload;
    },
    [actions.clearAll.TRIGGER]() {
      return {};
    }
  },
  {}
);

const stats = combineReducers({
  status: statsStatus,
  data: statsData
});

const commentsStatus = makeStatusWithResetReducer(actions.fetchComments, actions.clearAll.TRIGGER);

const commentsData = handleActions(
  {
    [actions.fetchComments.SUCCESS](state, { payload }) {
      return payload;
    },
    [actions.clearAll.TRIGGER]() {
      return [];
    }
  },
  []
);

const comments = combineReducers({
  status: commentsStatus,
  data: commentsData
});

const productsStatus = makeStatusWithResetReducer(actions.fetchProducts, actions.clearAll.TRIGGER);

const subjectsData = handleActions(
  {
    [actions.fetchProducts.SUCCESS](state, { payload }) {
      return payload.subjects;
    },
    [actions.clearAll.TRIGGER]() {
      return [];
    }
  },
  []
);

const tagsData = handleActions(
  {
    [actions.fetchProducts.SUCCESS](state, { payload }) {
      return payload.tags;
    },
    [actions.clearAll.TRIGGER]() {
      return [];
    }
  },
  []
);

const products = combineReducers({
  status: productsStatus,
  data: combineReducers({
    tags: tagsData,
    subjects: subjectsData
  })
});

const companyProfile = combineReducers({
  radar,
  topScores,
  stats,
  comments,
  products
});

export default companyProfile;
