/* eslint-disable */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import opinionDetailsSelectors from '../../modules/opinionDetails/opinionDetailsSelectors';
import CtruPieChart from './CtruPieChart';
import { withRouter } from 'react-router-dom';
import routing from '../../utils/routing';

function CtruPieChartContainer(props) {
  return <CtruPieChart {...props} />;
}

const mapStateToProps = (state, { match: { path, params } }) => {
  const selectedCriteriaId = opinionDetailsSelectors.selectedCriteria(state);
  const selectedSubjectId = opinionDetailsSelectors.selectedSubject(state);
  const selectedTopic = opinionDetailsSelectors.selectedTopic(state);
  const status = opinionDetailsSelectors.getCriteriaStatus(state);

  let changeOpinionLink;

  if (
    path !== routing().myOpinionDetails &&
    status === 'success' &&
    selectedSubjectId &&
    selectedTopic
  ) {
    const { id, type } = params;
    console.log({
      id,
      type,
      subjectId: selectedSubjectId,
      topicId: selectedTopic.topicId
    });

    changeOpinionLink = routing({
      id,
      type,
      subjectId: selectedSubjectId,
      topicId: selectedTopic.topicId
    }).shareOpinionWithProfile;
  }

  return {
    status,
    selectedCriteriaId,
    selectedSubjectId,
    selectedTopic,
    changeOpinionLink
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps)
)(CtruPieChartContainer);
