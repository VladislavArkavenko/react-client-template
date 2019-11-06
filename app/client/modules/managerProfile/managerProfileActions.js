import { put, takeLatest, all, call, select } from 'redux-saga/effects';

import ManagerService from '../../services/manager';
import createRequestRoutine from '../helpers/createRequestRoutine';
import createOnlyTriggerRoutine from '../helpers/createOnlyTriggerRoutine';
import parseRadarScores from '../helpers/parseRadarScores';
import CompaniesService from '../../services/companies';
import companiesSelectors from '../companies/companiesSelectors';

export const prefix = 'managerProfile';
const createRequestBound = createRequestRoutine.bind(null, prefix);
const createOnlyTriggerBound = createOnlyTriggerRoutine.bind(null, prefix);

export const fetchUserData = createRequestBound('USER_DATA_FETCH');
export const fetchRadarScores = createRequestBound('RADAR_SCORES_FETCH');
export const fetchTopScores = createRequestBound('TOP_SCORES_FETCH');
export const fetchStatistics = createRequestBound('STATISTICS_FETCH');
export const fetchComments = createRequestBound('COMMENTS_FETCH');

export const fetchAll = createRequestBound('FETCH_ALL');
export const clearAll = createOnlyTriggerBound('CLEAR_ALL');

function* getRadarScoresWorker({ payload }) {
  yield put(fetchRadarScores.request());
  try {
    const scores = yield call(ManagerService.getRadarScores, payload);

    const data = parseRadarScores(scores);

    yield put(fetchRadarScores.success(data));
  } catch (err) {
    console.error(err);
    // Notification.error(err);
    yield put(fetchRadarScores.failure());
  }
}

function* getTopScoresWorker({ payload }) {
  yield put(fetchTopScores.request());
  try {
    const scores = yield call(ManagerService.getTopScores, payload);
    yield call(ManagerService.getProfile, payload);

    yield put(fetchTopScores.success(scores));
  } catch (err) {
    console.error(err);
    // Notification.error(err);
    yield put(fetchTopScores.failure());
  }
}

function* getStatisticsWorker({ payload }) {
  yield put(fetchStatistics.request());
  try {
    const { id } = yield select(companiesSelectors.findCompanyByManager, payload);
    const [managerStats, companyStats] = yield all([
      call(ManagerService.getStatistics, payload),
      call(CompaniesService.getStatistics, id)
    ]);

    yield put(fetchStatistics.success({ managerStats, companyStats }));
  } catch (err) {
    console.error(err);
    yield put(fetchStatistics.failure());
  }
}

function* getCommentsWorker({ payload }) {
  yield put(fetchComments.request());
  try {
    const comments = yield call(ManagerService.getComments, payload);

    yield put(fetchComments.success(comments));
  } catch (err) {
    console.error(err);
    yield put(fetchComments.failure());
  }
}

function* getUserDataWorker({ payload }) {
  yield put(fetchUserData.request());
  try {
    const { userData, ...managerStats } = yield call(ManagerService.getProfile, payload);

    yield put(fetchUserData.success({ ...userData, ...managerStats }));
  } catch (err) {
    console.error(err);
    // Notification.error(err);
    yield put(fetchUserData.failure());
  }
}

function* fetchAllWorker({ payload }) {
  yield put(fetchAll.request());
  const taskList = [
    getUserDataWorker,
    getTopScoresWorker,
    getRadarScoresWorker,
    getCommentsWorker,
    getStatisticsWorker
  ];

  yield all(taskList.map((task) => call(task, { payload })));

  yield put(fetchAll.success());
}

export function* managerProfileWatcher() {
  yield all([
    takeLatest(fetchAll.TRIGGER, fetchAllWorker),

    takeLatest(fetchUserData.TRIGGER, getUserDataWorker),
    takeLatest(fetchRadarScores.TRIGGER, getRadarScoresWorker),
    takeLatest(fetchTopScores.TRIGGER, getTopScoresWorker),
    takeLatest(fetchStatistics.TRIGGER, getStatisticsWorker),
    takeLatest(fetchComments.TRIGGER, getCommentsWorker)
  ]);
}
