import React from 'react';
import { Link } from 'react-router-dom';

import Icon from './Icon';

import calculatePositionByAngle from './helpers/calculatePositionByAngle';
import routing from '../../../utils/routing';

import { FEATURES, CATEGORIES } from './const';

const { NAME_ID } = FEATURES;
const { FEATURES: C_FEATURES } = CATEGORIES;

// TODO: Rewrite using formulas.
const featuresMap = {
  0: [-10, -50],
  45: [-30, -70],
  90: [-50, -90],
  135: [-70, -70],
  180: [-90, -50],
  225: [-70, -30],
  270: [-50, -10],
  315: [-30, -30]
};

const categoriesMap = {
  0: [20, -50],
  90: [-50, -120],
  180: [-120, -50],
  270: [-50, 20]
};

const Details = ({ detailsData, feature, category, featuresDetails, categoriesDetails }) => {
  if (!feature && !category) {
    return null;
  }

  const { data, name } = feature || category;
  const i = data.findIndex(({ y }) => y > 0);

  let to;
  let angle;
  let transform;
  let entries;
  let participationShare;

  if (feature) {
    const { count = 0, participation = 0 } = (featuresDetails && featuresDetails[name]) || {};

    const params = {
      ...detailsData,
      criteriaId: NAME_ID[name]
    };
    to = routing(params).opinionDetails;
    entries = count;
    participationShare = participation;
    angle = i * (360 / data.length);
    transform = `translate(${featuresMap[angle][0]}%, ${featuresMap[angle][1]}%)`;
  }
  if (category) {
    const { count, participation } = categoriesDetails
      ? categoriesDetails[name]
      : { count: 0, participation: 0 };

    const params = {
      ...detailsData,
      criteriaId: NAME_ID[C_FEATURES[name][1]]
    };
    to = routing(params).opinionDetails;
    entries = count;
    participationShare = participation;
    angle = i === 0 ? 0 : (i + 1) * (360 / data.length);
    transform = `translate(${categoriesMap[angle][0]}%, ${categoriesMap[angle][1]}%)`;
  }

  const { top, left } = calculatePositionByAngle(angle * (Math.PI / 180));

  return (
    <div
      className="p-absolute details"
      style={{
        top,
        left,
        transform
      }}
    >
      <Icon line name={name} />
      <div className="wrapper">
        <h4>{name}</h4>
        <div className="info-line">
          <p>Entries</p>
          <h6>{entries || '—'}</h6>
        </div>
        <div className="info-line">
          <p>Participation share</p>
          <h6>{participationShare ? `${participationShare}%` : '—'}</h6>
        </div>
        <div className="link">
          <Link to={to}>Details</Link>
        </div>
      </div>
    </div>
  );
};

export default Details;
