import { setApiHeaders } from '../utils/api';
import reducerRegistry from '../utils/reducerRegistry';
import AuthService from '../services/auth';
import { ROLES } from '../constants';

const {
  CUSTOMER, ADMIN, ANALYST, MANAGER,
} = ROLES;

// TODO: Think about saving activeRole to localStorage.

const reducerName = 'auth';

const createActionName = name => `app/${reducerName}/${name}`;

const SET_USER = createActionName('SET_USER');
const SET_ACTIVE_ROLE = createActionName('SET_ACTIVE_ROLE');
const SET_ROLES = createActionName('SET_ROLES');
const AUTHORIZE = createActionName('AUTHORIZE');

const initialState = {
  user: null,
  isAuthorized: null,
  activeRole: null, // CUSTOMER/MANAGER/ANALYST/ADMIN
  rolesPermissions: null, // { CUSTOMER: [id], MANAGER: id, ANALYST: id, ADMIN: id }
  companies: null, // { id1: {}, id2: {}, ... }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case AUTHORIZE:
      return {
        ...state,
        isAuthorized: action.isAuthorized,
      };
    case SET_ROLES: {
      const {
        companies,
        rolesPermissions,
        activeRole,
      } = action;

      return {
        ...state,
        companies,
        rolesPermissions,
        activeRole,
      };
    }
    case SET_ACTIVE_ROLE:
      return {
        ...state,
        activeRole: action.role,
      };
    default:
      return state;
  }
}

export const setTokens = ({ access, refresh }) => {
  if (access) {
    localStorage.setItem('access_token', access);
    setApiHeaders({ Authorization: `Bearer ${access}` });
  }
  if (refresh) {
    localStorage.setItem('refresh_token', refresh);
  }
};

const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  setApiHeaders({ Authorization: '' });
};

// Helper actions
const setUser = user => ({
  user,
  type: SET_USER,
});

const toggleAuthorize = (isAuthorized = true) => ({
  isAuthorized,
  type: AUTHORIZE,
});

export const setActiveRole = role => ({
  role,
  type: SET_ACTIVE_ROLE,
});

const setRoles = ({ companies, rolesPermissions, activeRole }) => ({
  activeRole,
  companies,
  rolesPermissions,
  type: SET_ROLES,
});

function obtainTokens(data, cb) {
  return dispatch => AuthService.obtainTokens(data)
    .then((tokens) => {
      setTokens(tokens);
      dispatch(toggleAuthorize());
      cb();
    })
    .catch((err) => {
      dispatch(toggleAuthorize(false));
      cb(err);
    });
}

// External actions
export function useRefreshToken(cb) {
  return (dispatch) => {
    const refresh = localStorage.getItem('refresh_token');
    const errCb = (err = true) => {
      dispatch(toggleAuthorize(false));
      removeTokens();
      cb(err);
    };

    if (refresh) {
      return AuthService.refresh({ refresh })
        .then((tokens) => {
          setTokens(tokens);
          dispatch(toggleAuthorize());
          cb();
        })
        .catch(errCb);
    }

    return errCb();
  };
}

// TODO: Remove this fn to another file.
function stateFromRes({ customers, staff }) {
  const {
    company,
    isObject,
    isAnalyst,
    isManager,
  } = staff;

  let activeRole = null;
  const companies = {};
  const rolesPermissions = {};

  if (customers.length) {
    rolesPermissions[CUSTOMER] = [];
    customers.forEach((cmp) => {
      const { id } = cmp;

      companies[id] = cmp;
      rolesPermissions[CUSTOMER].push(id);
    });
  }

  if (company) {
    const { id } = company;

    companies[id] = company;
    if (isObject) {
      rolesPermissions[MANAGER] = id;
    }
    if (isAnalyst) {
      rolesPermissions[ANALYST] = id;
    }
    if (isManager) {
      rolesPermissions[ADMIN] = id;
    }
  }

  const availableRoles = Object.keys(rolesPermissions);
  if (availableRoles.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    activeRole = availableRoles[0];
  }

  return { companies, rolesPermissions, activeRole };
}

export function getRoles(cb) {
  return dispatch => AuthService.getRoles()
    .then((res) => {
      dispatch(setRoles(stateFromRes(res)));
      cb && cb();
    })
    .catch((err) => {
      cb && cb(err);
    });
}

export function getUser(cb) {
  return dispatch => AuthService.getUser()
    .then((user) => {
      dispatch(setUser(user));
      dispatch(getRoles(cb));
      dispatch(toggleAuthorize());
      cb && cb();
    })
    .catch((err) => {
      // If 401 we try to use refresh token (In axios interceptor).
      if (err.status !== 401) {
        dispatch(toggleAuthorize(false));
      }
      cb && cb(err);
    });
}

export function login(data, cb) {
  return (dispatch) => {
    const newCb = (err) => {
      if (err) {
        cb(err);
      } else {
        dispatch(getUser(cb));
      }
    };

    dispatch(obtainTokens(data, newCb));
  };
}

export function register(data, cb) {
  return dispatch => AuthService.register(data)
    .then((user) => {
      const newCb = (err) => {
        if (err) {
          cb(err);
        } else {
          dispatch(getRoles(cb));
        }
      };

      dispatch(setUser(user));
      dispatch(obtainTokens(data, newCb));
    })
    .catch(cb);
}

reducerRegistry.register(reducerName, reducer);
