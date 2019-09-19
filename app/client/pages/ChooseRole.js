import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Icon from './chooseRole/Icon';
import { setActiveRole } from '../modules/auth/authActions';
import AuthGuard from '../components/HOCs/AuthGuard';
import Loader from '../components/ui-components/Loader';
import routing from '../utils/routing';
import authSelectors from '../modules/auth/authSelectors';

// TODO: Split text to locales file.
class ChooseRole extends React.Component {
  constructor(props) {
    super(props);

    this.setActiveRole = this.setActiveRole.bind(this);
  }

  setActiveRole(role) {
    const { setActiveRole } = this.props;

    setActiveRole(role);
  }

  render() {
    const { activeRole, rolesPermissions } = this.props;

    if (activeRole) {
      return <Redirect to={routing().about} />;
    }

    if (!rolesPermissions) {
      return <Loader />;
    }

    return (
      <div className="form-page choose-role-page">
        <div className="roles-content">
          <h1 className="form-page__title"> Choose your role </h1>
          <div className="cards">
            {Object.keys(rolesPermissions).map((role) => (
              <button key={role} onClick={() => this.setActiveRole(role)}>
                <Icon role={role} />
                <h6>{role}</h6>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeRole: authSelectors.activeRole(state),
  rolesPermissions: authSelectors.rolePermissions(state)
});

const mapDispatchToProps = {
  setActiveRole
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseRole);
