import React from 'react';

import { VictoryBar } from 'victory';

function randomInt(min = 0.1, max = 6) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const data = [];
for (let x = 0; x < 8; x += 1) {
  data.push({ x, y: randomInt() });
}

// eslint-disable-next-line react/prefer-stateless-function
class SatisfiedClients extends React.Component {
  render() {
    const { avgSatisfaction } = this.props;

    return (
      <div className="d-flex satisfied-clients">
        <div className="info">
          <h1>{avgSatisfaction !== undefined ? `${avgSatisfaction}%` : '—'}</h1>
          <p> Satisfied clients </p>
        </div>
        <VictoryBar
          data={data}
          domain={[0, 6]}
          width={110}
          height={25}
          padding={{ top: 0, bottom: 0, right: 6, left: 6 }}
          style={{
            data: { width: 12, fill: 'white' }
          }}
        />
      </div>
    );
  }
}

export default SatisfiedClients;
