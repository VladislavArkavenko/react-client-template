import React from 'react';
import RateListHeading from './RateListHeading';
import RateListItem from './RateListItem';
import { RATE_PROFILE_TYPE } from '../../../../utils/constants';

const { MANAGER, COMPANY } = RATE_PROFILE_TYPE;

export default class RateList extends React.Component {
  componentDidMount() {
    const { companies, managers, handleSelect } = this.props;

    if (managers.length) {
      //select first manager in the list
      handleSelect({ data: managers[0], type: MANAGER });
    } else if (companies.length) {
      //select first company in the list
      handleSelect({ data: companies[0], type: COMPANY });
    }
  }

  render() {
    const { companies, managers, selected, handleSelect } = this.props;

    const companiesList = companies.map((company) => (
      <RateListItem
        key={`${company.id}_c`}
        data={company}
        selected={selected}
        handleSelect={handleSelect}
        isCompany
      />
    ));

    const managersList = managers.map((manager) => (
      <RateListItem
        key={`${manager.id}_m`}
        data={manager}
        selected={selected}
        handleSelect={handleSelect}
      />
    ));

    return (
      <ul className="rate-list">
        <RateListHeading>My companies</RateListHeading>
        {companiesList}
        <RateListHeading>My managers</RateListHeading>
        {managersList}
      </ul>
    );
  }
}
