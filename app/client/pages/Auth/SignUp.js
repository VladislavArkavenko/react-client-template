import React from 'react';
import i18next from 'i18next';
import queryString from 'query-string';
import { connect } from 'react-redux';
import routing from '../../utils/routing';
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
  validatePhone
} from '../../utils/validator';
import TextInput from '../../components/ui-components/Form/TextInput';
import PasswordInput from '../../components/PasswordInput';
import { pushSignUp } from '../../modules/auth/authActions';
import CheckboxInput from '../../components/ui-components/Form/CheckboxInput';

const initialErrorsState = {
  errorFirstName: '',
  errorLastName: '',
  errorEmail: '',
  errorPhone: '',
  errorPassword: '',
  errorPolicy: false
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      policy: false,
      token: null,
      ...initialErrorsState
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      location: { search },
      history
    } = this.props;
    const { token, email } = queryString.parse(search);

    const newState = {};
    if (token) {
      newState.token = token;
    } else {
      return history.push(routing().notFound);
    }
    if (email) {
      newState.email = email;
    }

    return this.setState(newState);
  }

  onChange(e) {
    const { value, name, type, checked } = e.target;

    this.setState({ [name]: type === 'checkbox' ? checked : value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ ...initialErrorsState });

    const { pushSignUp, history } = this.props;
    const { firstName, lastName, email, phone, password, policy, token } = this.state;

    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneValid = validatePhone(phone);

    if (
      isEmailValid &&
      isPasswordValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isPhoneValid &&
      policy
    ) {
      const input = {
        firstName,
        lastName,
        phone,
        email,
        password,
        token
      };

      pushSignUp({ input, history });
      // register(data, (err) => (err ? displayError(err) : history.push(routing().root)));
    } else {
      const newState = {};

      if (!isEmailValid) {
        newState.errorEmail = i18next.t('errors.email');
      }
      if (!isPasswordValid) {
        newState.errorPassword = i18next.t('errors.password');
      }
      if (!isFirstNameValid) {
        newState.errorFirstName = i18next.t('errors.name.first');
      }
      if (!isLastNameValid) {
        newState.errorLastName = i18next.t('errors.name.last');
      }
      if (!isPhoneValid) {
        newState.errorPhone = i18next.t('errors.phone');
      }
      if (!policy) {
        newState.errorPolicy = true;
      }

      this.setState(newState);
    }
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      policy,
      errorFirstName,
      errorLastName,
      errorEmail,
      errorPhone,
      errorPassword,
      errorPolicy
    } = this.state;

    //TODO: add confirm password field

    return (
      <div className="form-page">
        <div className="container">
          <h1 className="form-page__title">{i18next.t('register.title')}</h1>

          <div className="form-wrapper">
            <form className="form" onSubmit={this.handleSubmit}>
              <TextInput
                value={firstName}
                error={errorFirstName}
                onChange={this.onChange}
                name="firstName"
                labelText={i18next.t('register.name.first')}
              />
              <TextInput
                value={lastName}
                error={errorLastName}
                onChange={this.onChange}
                name="lastName"
                labelText={i18next.t('register.name.last')}
              />
              <TextInput
                value={email}
                error={errorEmail}
                onChange={this.onChange}
                name="email"
                labelText={i18next.t('register.email')}
              />
              <TextInput
                value={phone}
                error={errorPhone}
                onChange={this.onChange}
                name="phone"
                labelText={i18next.t('register.phone')}
              />
              <PasswordInput
                showIndicator
                showTooltip
                name="password"
                value={password}
                error={errorPassword}
                onChange={this.onChange}
                labelText={i18next.t('register.password')}
              />

              <CheckboxInput
                name="policy"
                checked={policy}
                onChange={this.onChange}
                className="policy-agreement"
                type="checkbox"
                error={errorPolicy}
                labelText={i18next.t('register.policy')}
              />
              <div className="form__bottom">
                <button type="submit" className="button form__submit-btn">
                  {i18next.t('register.buttons.signUp')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  history: props.history,
  location: props.location
});

const mapDispatchToProps = {
  pushSignUp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
