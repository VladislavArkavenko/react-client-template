/* eslint-disable */
import React from 'react';

import AuthGuard from '../components/HOCs/AuthGuard';
import RolesManager from '../components/HOCs/RolesManager';

// eslint-disable-next-line react/prefer-stateless-function
class Profile extends React.Component {
  render() {
    return (
      <div className="content">
        <img src="/assets/img/sss.png" alt="" style={{ width: '100%' }}/>
      </div>
    );
  }
}

export default AuthGuard(RolesManager(Profile));