import React from 'react';
import Slider from 'rc-slider/lib/Slider';
import { connect } from 'react-redux';

import { setParticipationValue } from '../../modules/kpiSettings/kpiSettingsActions';
import OptionWrapper from './OptionWrapper';
import kpiSettingsSelectors from '../../modules/kpiSettings/kpiSettingsSelectors';

class ParticipationOption extends React.Component {
  static handleFormat(value) {
    if (Number.isNaN(value)) {
      return '-%';
    }

    return `${value.toFixed()}%`;
  }

  constructor(props) {
    super(props);

    this.handleReset = this.handleReset.bind(this);
  }

  handleReset() {
    const { initialValue, setValue } = this.props;
    setValue(initialValue);
  }

  render() {
    const { currentValue, initialValue, setValue } = this.props;

    return (
      <OptionWrapper
        title="Participation Share"
        oldValue={initialValue}
        newValue={currentValue}
        handleReset={this.handleReset}
        formatValue={ParticipationOption.handleFormat}
      >
        <Slider
          min={0}
          max={100}
          step={1}
          onChange={setValue}
          value={currentValue}
          className="kpi-slider"
        />
      </OptionWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  const status = kpiSettingsSelectors.getSettingsStatus(state);
  const { participation: initialValue } = kpiSettingsSelectors.getSettingsData(state);

  const currentValue = kpiSettingsSelectors.getParticipation(state);

  return {
    status,
    initialValue,
    currentValue
  };
};

const mapDispatchToProps = {
  setValue: setParticipationValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipationOption);
