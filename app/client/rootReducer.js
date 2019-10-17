import { combineReducers } from 'redux';
import auth from './modules/auth/authReducer';
import companies from './modules/companies/companiesReducer';
import shareOpinion from './modules/shareOpinion/shareOpinionReducer';
import staff from './modules/staff/staffReducer';
import clients from './modules/clients/clientsReducer';
import managerProfile from './modules/managerProfile/managerProfileReducer';
import companyProfile from './modules/companyProfile/companyProfileReducer';
import profile from './modules/profile/profileReducer';
import dashboard from './modules/dashboard/dashboardReducer';
import opinions from './modules/opinions/opinionsReducer';
import { pushLogout } from './modules/auth/authActions';

const appReducer = combineReducers({
  auth,
  companies,
  shareOpinion,
  staff,
  clients,
  profile,
  dashboard,
  managerProfile,
  companyProfile,
  opinions
});

export default (state, action) => {
  if (action.type === pushLogout.TRIGGER) {
    state = undefined;
  }

  return appReducer(state, action);
};
