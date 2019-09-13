/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';

import AuthGuard from '../components/HOCs/AuthGuard';
import RolesManager from '../components/HOCs/RolesManager';
import { ROLES } from '../constants';
import { updateCompany } from '../modules/auth';

import SvgMapMarker from '../../../public/assets/svg/map-marker.svg';
import SvgPen from '../../../public/assets/svg/pen.svg';

const {
  CUSTOMER, ADMIN,
} = ROLES;

const EditIcon = ({ onClick }) => (
  <div className="edit-wrapper" onClick={onClick}>
    <SvgPen />
  </div>
);

// eslint-disable-next-line react/prefer-stateless-function
class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };

    this.aboutRef = React.createRef();
    this.phoneRef = React.createRef();
    this.webRef = React.createRef();
    this.mailRef = React.createRef();

    this.clickContactsSave = this.clickContactsSave.bind(this);
    this.clickAboutSave = this.clickAboutSave.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleEditFor = this.toggleEditFor.bind(this);
  }

  clickAboutSave() {
    const { updateCompany } = this.props;

    updateCompany({ about: this.aboutRef.current.value }, () => this.toggleEditFor('About'));
  }

  clickContactsSave() {
    const { updateCompany } = this.props;

    updateCompany(
      {
        phone: this.phoneRef.current.value,
        web: this.webRef.current.value,
        mail: this.mailRef.current.value
      },
      () => this.toggleEditFor('Contacts')
    );
  }

  toggleEditing() {
    this.setState(state => ({
      editing: !state.editing,
    }));
  }

  toggleEditFor(block) {
    this.setState(state => ({
      [`editing${block}`]: !state[`editing${block}`],
    }));
  }

  render() {
    const {
      user,
      activeRole,
      rolesPermissions,
      companies,
    } = this.props;
    const { editing, editingAbout, editingContacts } = this.state;

    const {
      firstName,
      lastName,
      location,
    } = user;

    let email;
    let avatar;
    let phone;
    let web;
    let about;
    let name;
    let profileTitle;

    if (activeRole === ADMIN) {
      console.log('companies[rolesPermissions[activeRole]]', companies, rolesPermissions, activeRole);
      const {
        email: e, avatar: a, phone: p, web: w, about: ab, name: n,
      } = companies[rolesPermissions[activeRole]];
      email = e;
      avatar = a;
      phone = p;
      web = w;
      about = ab;
      name = n;
      profileTitle = '89% satisfied clients';
    } else {
      const {
        email: e, avatar: a, phone: p, web: w, about: ab, title,
      } = user;
      email = e;
      avatar = a;
      phone = p;
      web = w;
      about = ab;
      name = `${firstName} ${lastName}`;
      profileTitle = activeRole === CUSTOMER ? 'I\'m satisfied' : title;
    }
    const aboutTitle = activeRole === CUSTOMER ? 'Biography' : 'Portrait';

    return (
      <div className="content">
        <div className="content-header">
          <div className="avatar">
            <div className="img-wrapper">
              <img src={avatar || 'assets/img/empty-avatar.jpg'} alt="Avatar" />
            </div>
          </div>
          <div className="info">
            {
              editing
                ? (
                  <>
                    <input type="text" defaultValue={name} className="input-header"/>
                    <button className="edit-photo-btn">
                      Edit photo
                    </button>
                  </>
                )
                : (
                  <>
                    <h1>{name}</h1>
                    <h2>{profileTitle}</h2>
                  </>
                )
            }
            {
              activeRole !== ADMIN
              && (
                <div className="location">
                  <SvgMapMarker />
                  <p>
                    {location}
                  </p>
                </div>
              )
            }
          </div>
          <div className="buttons">
            <button className="edit-btn" onClick={this.toggleEditing}>
              <SvgPen />
              Edit
            </button>
          </div>
          <ul className="content-nav-bar">
            <li>Overview</li>
            <li className="active">About</li>
          </ul>
        </div>
        <div className="content-body">
          <div className="main">
            <div className="info-block">
              <h1>
                {aboutTitle}
              </h1>
              {
                editingAbout
                  ? (
                    <textarea
                      ref={this.aboutRef}
                      defaultValue={about}
                    />
                    )
                  : (
                    <p>
                      {about}
                    </p>
                  )
              }
              <EditIcon onClick={() => this.toggleEditFor('About')} />
              {
                editingAbout
                && (
                  <button className="save-btn" onClick={this.clickAboutSave}> Save </button>
                )
              }
            </div>
          </div>
          <div className="sidebar">
            <div className="info-block">
              <EditIcon onClick={() => this.toggleEditFor('Contacts')} />
              <h1> Contacts </h1>
              <div className="info-line">
                <p> Phone </p>
                {
                  editingContacts
                    ? (
                      <input
                        ref={this.phoneRef}
                        defaultValue={phone}
                      />
                    )
                    : (
                      <a href={`tel:${phone}`}>
                        {phone}
                      </a>
                    )
                }
              </div>
              {
                activeRole === ADMIN
                && (
                  <div className="info-line">
                    <p> Web </p>
                    {
                      editingContacts
                        ? (
                          <input
                            ref={this.webRef}
                            defaultValue={web}
                          />
                        )
                        : (
                          <a href={web}>
                            {web}
                          </a>
                        )
                    }
                  </div>
                )
              }
              <div className="info-line">
                <p> Mail </p>
                {
                  editingContacts
                    ? (
                      <input
                        ref={this.mailRef}
                        defaultValue={email}
                      />
                    )
                    : (
                      <a href={`mailto:${email}`}>
                        {email}
                      </a>
                    )
                }
              </div>
              {
                editingContacts
                && (
                  <button className="save-btn-b" onClick={this.clickContactsSave}> Save </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  activeRole: state.auth.activeRole,
  rolesPermissions: state.auth.rolesPermissions,
  companies: state.auth.companies,
});

export default AuthGuard(RolesManager(connect(mapStateToProps, { updateCompany })(Profile)));
