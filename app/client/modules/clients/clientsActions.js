/* eslint-disable */

import { call, put, takeLatest, all, select } from 'redux-saga/effects';
// import i18next from 'i18next';

import createRequestRoutine from '../helpers/createRequestRoutine';
import createOnlyTriggerRoutine from '../helpers/createOnlyTriggerRoutine';
import Notification from '../../utils/notifications';
import StaffService from '../../services/staff';
import { ROLES, STAFF_TABLE_STATUS, STAFF_TABLE_TYPE } from '../../utils/constants';
import staffSelectors from './clientsSelectors';
import { validateInviteCustomerRow, validateUpdateStaffRow } from '../../utils/validator';

import normalizeManagers from './helpers/normalizeManagers';
import normalizeUserData from './helpers/normalizeUserData';
import sortUserRowsByDate from './helpers/sortUserRowsByDate';

import authSelectors from '../auth/authSelectors';
import ClientsService from '../../services/clients';
import CompaniesService from '../../services/companies';
import clientsSelectors from './clientsSelectors';

export const prefix = 'clients';
const createRequestBound = createRequestRoutine.bind(null, prefix);
const createOnlyTriggerBound = createOnlyTriggerRoutine.bind(null, prefix);

export const fetchClientsTables = createRequestBound('TABLES_FETCH');

export const pushSendInvitations = createRequestBound('INVITATIONS_SEND');
export const pushResendInvitations = createRequestBound('INVITATIONS_RESEND');

export const pushUsersChanges = createRequestBound('USER_CHANGES_PUSH');

export const saveTableField = createOnlyTriggerBound('FIELD_SAVE');
export const createNewRow = createOnlyTriggerBound('NEW_ROW_CREATE');
export const setUsersStatus = createRequestBound('USER_STATUS_SET');

export const selectAllRows = createOnlyTriggerBound('ALL_ROWS_SELECT');
export const changeTableManager = createOnlyTriggerBound('MANAGER_CHANGE');

function* clientsTablesWorker() {
  yield put(fetchClientsTables.request());
  try {
    const [pendingData, activeData, managersData] = yield all([
      call(ClientsService.getPendingCustomers),
      call(ClientsService.getActiveCustomers),
      call(CompaniesService.getManagersList)
    ]);

    const managers = normalizeManagers(managersData);

    const pending = pendingData
      .map((userData) => normalizeUserData(userData, managers))
      .sort(sortUserRowsByDate);

    const currentUserId = yield select(authSelectors.getCurrentUserId);
    const active = activeData
      .filter((userData) => userData.id !== currentUserId)
      .map((userData) => normalizeUserData(userData, managers, STAFF_TABLE_STATUS.ACTIVE))
      .sort(sortUserRowsByDate);

    yield put(fetchClientsTables.success({ pending, active, managers }));
  } catch (err) {
    console.error(err);
    Notification.error(err);
    yield put(fetchClientsTables.failure());
  }
}

function* createClientTask({ fields, tempId }) {
  try {
    const user = yield call(ClientsService.sendInvite, fields);

    user.tempId = tempId;

    Notification.success(
      `Invitations has been sent to ${fields.userData.firstName} ${fields.userData.lastName}`
    );

    return user;
  } catch (err) {
    Notification.error(err);
    return null;
  }
}

function* clientInvitationsWorker() {
  yield put(pushSendInvitations.request());
  try {
    const checkedRows = yield select(
      staffSelectors.getOnlyCheckedRows,
      STAFF_TABLE_TYPE.INVITATIONS
    );

    const selectedRows = checkedRows.filter((item) => !item.status);

    const { errors, isValid } = validateInviteCustomerRow(selectedRows);

    if (isValid) {
      const tasks = selectedRows.map((item) => {
        const { email, firstName, lastName, manager, id } = item;
        const fields = {
          userData: { email, firstName, lastName },
          manager: manager.value
        };

        return call(createClientTask, { fields, tempId: id });
      });

      const resolvedTasks = yield all(tasks);

      const onlySuccess = resolvedTasks.filter((item) => item !== null);

      const managers = yield select(clientsSelectors.getManagers);
      const normalized = onlySuccess.map((user) => ({
        ...normalizeUserData(user, managers, STAFF_TABLE_STATUS.PENDING),
        tempId: user.tempId
      }));

      yield put(pushSendInvitations.success(normalized));
    } else {
      console.error(errors);
      yield put(pushSendInvitations.failure(errors));
    }
  } catch (err) {
    console.error(err);
    Notification.error(err);
    yield put(pushSendInvitations.failure());
  }
}

function* staffResendWorker() {
  const selectedRows = yield select(
    clientsSelectors.getOnlyCheckedWithStatusRows,
    STAFF_TABLE_TYPE.INVITATIONS,
    STAFF_TABLE_STATUS.EXPIRED
  );

  if (selectedRows.length) {
    yield put(pushResendInvitations.request());
    try {
      yield call(StaffService.resendInvite, {
        emails: selectedRows.map((row) => row.email)
      });
      Notification.success('Invitations has been resent');
      yield put(pushResendInvitations.success(selectedRows));
    } catch (err) {
      Notification.error(err);
      yield put(pushResendInvitations.failure());
    }
  }
}

function* updateStaffTask({ fields, id, originalUser }) {
  try {
    const { firstName, lastName } = originalUser;
    const user = yield call(ClientsService.updateUser, { userId: id, data: fields });

    user.manager = fields.manager;

    Notification.success(`User ${firstName} ${lastName} has been updated`);

    return user;
  } catch (err) {
    console.error(err);
    Notification.error(err);
    return null;
  }
}

function* staffUpdateWorker() {
  yield put(pushUsersChanges.request());
  try {
    const selectedRows = yield select(staffSelectors.getOnlyChangedRows, 'active');
    //check only roles field
    const { errors, isValid } = validateInviteCustomerRow(selectedRows);

    if (isValid) {
      const tasks = selectedRows.map((item) => {
        const { id, _changes } = item;
        const fields = {
          manager: _changes.manager.value
        };

        return call(updateStaffTask, { fields, id, originalUser: item });
      });

      const resolvedTasks = yield all(tasks);

      const onlySuccess = resolvedTasks.filter((item) => item !== null);

      const managers = yield select(clientsSelectors.getManagers);

      const normalized = onlySuccess.map((user) =>
        normalizeUserData(user, managers, STAFF_TABLE_STATUS.ACTIVE)
      );

      const updatedUsers = {};

      normalized.forEach((user) => {
        updatedUsers[user.id] = user;
      });

      yield put(pushUsersChanges.success(updatedUsers));
    } else {
      yield put(pushUsersChanges.failure(errors));
    }
  } catch (err) {
    console.error(err);
    yield put(pushUsersChanges.failure());
  }
}

function* unblockStaffTask({ id, originalUser }) {
  try {
    const { firstName, lastName } = originalUser;
    const user = { ...originalUser, roles: [ROLES.MANAGER] };

    yield call(StaffService.updateUser, {
      userId: id,
      data: {
        isManager: true
      }
    });
    Notification.success(`User ${firstName} ${lastName} has been unblocked`);
    return user;
  } catch (err) {
    Notification.error(`Failed to unblock ${originalUser.firstName} ${originalUser.lastName}`);
    return null;
  }
}

function* blockStaffTask({ id, originalUser }) {
  try {
    const { firstName, lastName } = originalUser;
    const user = { ...originalUser, roles: [] };

    yield call(StaffService.blockUser, id);

    Notification.success(`User ${firstName} ${lastName} has been blocked`);
    return user;
  } catch (err) {
    Notification.error(`Failed to block ${originalUser.firstName} ${originalUser.lastName}`);
    return null;
  }
}

function* staffStatusWorker({ payload }) {
  yield put(setUsersStatus.request());
  try {
    const { status } = payload;
    const checkedRows = yield select(staffSelectors.getOnlyCheckedRows, 'active');
    const selectedRows = checkedRows.filter((row) => {
      if (status === STAFF_TABLE_STATUS.BLOCKED) {
        //select only active users;
        return row.roles.length !== 0;
      }

      //select only blocked users;
      return row.roles.length === 0;
    });

    if (selectedRows.length) {
      const tasks = selectedRows.map((item) => {
        const { id } = item;

        if (status === STAFF_TABLE_STATUS.BLOCKED) {
          return call(blockStaffTask, { id, originalUser: item });
        }

        return call(unblockStaffTask, { id, originalUser: item });
      });

      const resolvedTasks = yield all(tasks);

      const onlySuccess = resolvedTasks.filter((item) => item !== null);

      const subjectsFlatten = yield select(staffSelectors.subjectListNormalized);

      const normalized = onlySuccess.map((user) =>
        normalizeUserData(user, subjectsFlatten, status)
      );

      const updatedUsers = {};

      normalized.forEach((user) => {
        updatedUsers[user.id] = user;
      });

      yield put(pushUsersChanges.success(updatedUsers));
    } else {
      yield put(setUsersStatus.failure());
    }
  } catch (err) {
    console.error(err);
    Notification.error(err);
    yield put(setUsersStatus.failure());
  }
}

export function* clientsWatcher() {
  yield all([
    takeLatest(fetchClientsTables.TRIGGER, clientsTablesWorker),
    takeLatest(pushSendInvitations.TRIGGER, clientInvitationsWorker),
    takeLatest(pushResendInvitations.TRIGGER, staffResendWorker),
    takeLatest(pushUsersChanges.TRIGGER, staffUpdateWorker)
    // takeLatest(setUsersStatus.TRIGGER, staffStatusWorker)
  ]);
}
