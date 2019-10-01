import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

import Alert from '../../../components/ui-components/Alert';
import YesSvg from '../../../../../public/assets/svg/check-circle.light.svg';
import ThinkSvg from '../../../../../public/assets/svg/emoji/3_1.svg';
import NoSvg from '../../../../../public/assets/svg/times-circle.light.svg';
import AlarmClockSvg from '../../../../../public/assets/svg/alarm-clock.svg';
import shareOpinionSelectors from '../../../modules/shareOpinion/shareOpinionSelectors';
import {
  pushUpdateTopics,
  selectReviewRecommend
} from '../../../modules/shareOpinion/shareOpinionActions';

function RecommendBlock({
  withComments,
  rate,
  title,
  handleRate,
  handleFinish,
  handleProceed,
  status
}) {
  const isRequest = status === 'request';
  const handleRateBound = ({ currentTarget }) => {
    handleRate(Number(currentTarget.dataset.rate));
  };

  return (
    <div className="container">
      <div className="opinion-rec">
        {withComments ? (
          <p className="opinion-rec__title">
            {rate === 1 && i18next.t('shareOpinion.rate.recommend', { title })}
            {rate === 2 && i18next.t('shareOpinion.rate.notSure', { title })}
            {rate === 3 && i18next.t('shareOpinion.rate.notRecommend', { title })}
          </p>
        ) : (
          <>
            <p className="opinion-rec__title">
              {i18next.t('shareOpinion.rate.question', { title })}
            </p>
            <div className="opinion-rec__list">
              <button
                type="button"
                data-rate={1}
                className={`opinion-rec__btn ${rate === 1 ? 'active' : ''}`}
                onClick={handleRateBound}
                disabled={isRequest}
              >
                <YesSvg />
                {i18next.t('shareOpinion.button.yes')}
              </button>

              <button
                type="button"
                data-rate={2}
                className={`opinion-rec__btn ${rate === 2 ? 'active' : ''}`}
                onClick={handleRateBound}
                disabled={isRequest}
              >
                <ThinkSvg />
                {i18next.t('shareOpinion.button.notSure')}
              </button>

              <button
                type="button"
                data-rate={3}
                className={`opinion-rec__btn ${rate === 3 ? 'active' : ''}`}
                onClick={handleRateBound}
                disabled={isRequest}
              >
                <NoSvg />
                {i18next.t('shareOpinion.button.no')}
              </button>
            </div>
            <div className="opinion-rec__remind">
              <button className="ask-btn">{i18next.t('shareOpinion.button.askLater')}</button>
              {false && (
                <Alert
                  type={Alert.info}
                  icon={<AlarmClockSvg />}
                  message={i18next.t('shareOpinion.alert.askLater')}
                />
              )}
            </div>
            <div className="opinion-rec__actions">
              <button className="action white" onClick={() => handleFinish()} disabled={isRequest}>
                {i18next.t('shareOpinion.button.save')}
              </button>
              <span className="or">or</span>
              <button className="action blue" onClick={() => handleProceed()} disabled={isRequest}>
                {i18next.t('shareOpinion.button.saveAndAdd')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { isRecommended } = shareOpinionSelectors.selectedOptions(state);
  const { title } = shareOpinionSelectors.selectedProfile(state) || {};

  return {
    title,
    rate: isRecommended,
    status: shareOpinionSelectors.finishStatus(state)
  };
};

const handleProceed = selectReviewRecommend.success;
const handleRate = selectReviewRecommend.trigger;

const mapDispatchToProps = {
  handleFinish: pushUpdateTopics,
  handleProceed,
  handleRate
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecommendBlock);
