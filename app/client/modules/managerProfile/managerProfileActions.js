import { put, takeLatest, all, call } from 'redux-saga/effects';

import ManagerService from '../../services/manager';
import Notification from '../../utils/notifications';
import createRequestRoutine from '../helpers/createRequestRoutine';
import { parseRadarData } from '../helpers/radarHelpers';

export const prefix = 'managerProfile';
const createRequestBound = createRequestRoutine.bind(null, prefix);

export const fetchRadarScores = createRequestBound('RADAR_SCORES_FETCH');
export const fetchSatisfiedClients = createRequestBound('SATISFIED_CLIENTS_FETCH');

function* getRadarScoresWorker({ payload }) {
  yield put(fetchRadarScores.request());
  try {
    const scores = yield call(ManagerService.getRadarScores, payload);

    const data = parseRadarData(scores);

    yield put(fetchRadarScores.success(data));
  } catch (err) {
    console.error(err);
    Notification.error(err);
    yield put(fetchRadarScores.failure());
  }
}

function* getSatisfiedClientsWorker({ payload }) {
  yield put(fetchSatisfiedClients.request());
  try {
    const { avgSatisfaction } = yield call(ManagerService.getSatisfiedClients, payload);

    yield put(fetchSatisfiedClients.success(avgSatisfaction));
  } catch (err) {
    console.error(err);
    Notification.error(err);
    yield put(fetchSatisfiedClients.failure());
  }
}

export function* managerProfileWatcher() {
  yield all([
    takeLatest(fetchRadarScores.TRIGGER, getRadarScoresWorker),
    takeLatest(fetchSatisfiedClients.TRIGGER, getSatisfiedClientsWorker)
  ]);
}
