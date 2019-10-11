import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import NAV_LINKS from './navLinks';
import authSelectors from '../../../../modules/auth/authSelectors';

const Sidebar = ({ role }) => (
  <ul className="nav-side-bar">
    {NAV_LINKS[role].map(({ title, Icon, to }) => (
      <li key={title}>
        <NavLink exact to={to} activeClassName="active" className="nav-link">
          <Icon />
          {title}
        </NavLink>
      </li>
    ))}
  </ul>
);

const mapStateToProps = (state) => ({
  role: authSelectors.activeRole(state)
});

export default connect(mapStateToProps)(Sidebar);
