import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';

import Logo from './Logo';
import { DEFAULT_LANGUAGE } from '../../../utils/config';
import { changeLanguage } from '../../../modules/language';

const options = [
  {
    value: 'en',
    label: 'EN'
  },
  {
    value: 'de',
    label: 'DE'
  }
];

// TODO: Add styling for language select.

class AuthTopBar extends React.Component {
  constructor(props) {
    super(props);

    this.selectLanguage = this.selectLanguage.bind(this);
  }

  selectLanguage({ value }) {
    const { changeLanguage } = this.props;

    changeLanguage(value);
  }

  render() {
    return (
      <header className="header-bar auth">
        <Logo className="header-bar__logo" />
        <Select
          options={options}
          onChange={this.selectLanguage}
          defaultValue={options.find(({ value }) => value === DEFAULT_LANGUAGE)}
          className="header-bar__lang"
          classNamePrefix="header-bar__lang"
        />
      </header>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  changeLanguage: (lng) => dispatch(changeLanguage(lng))
});

export default connect(
  null,
  mapDispatchToProps
)(AuthTopBar);
