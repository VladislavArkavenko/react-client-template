import React from 'react';
import { connect } from 'react-redux';

//TODO: MERGE: fix new action
import { ROLES } from '../utils/constants';
// import { updateCompany } from '../modules/companies';
import { pushUpdateCompany } from '../modules/companies/companiesActions';
import ProfileForAdmin from './profile/ProfileForAdmin';
import ProfileForAnalyst from './profile/ProfileForAnalyst';
import ProfileForManager from './profile/ProfileForManager';
import ProfileForCustomer from './profile/ProfileForCustomer';
import authSelectors from '../modules/auth/authSelectors';
import companiesSelectors from '../modules/companies/companiesSelectors';

const { ADMIN, MANAGER, ANALYST, CUSTOMER } = ROLES;

const Profile = (props) => {
  let Page;
  switch (props.activeRole) {
    case ADMIN:
      Page = ProfileForAdmin;
      break;
    case MANAGER:
      Page = ProfileForManager;
      break;
    case ANALYST:
      Page = ProfileForAnalyst;
      break;
    case CUSTOMER:
      Page = ProfileForCustomer;
      break;
    default:
      Page = null;
      break;
  }

  console.log('render profile');

  return (
    <div className="content">
      <Page {...props} />
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  ...props,
  activeRole: authSelectors.activeRole(state),
  rolesPermissions: authSelectors.rolePermissions(state),
  companies: companiesSelectors.data(state)
});

const mapDispatchToProps = {
  //updateCompany
  pushUpdateCompany
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
