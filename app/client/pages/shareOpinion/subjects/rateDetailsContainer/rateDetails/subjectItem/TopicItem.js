import React from 'react';
import SuccessCircleSvg from '../../../../../../../../public/assets/svg/check-circle.svg';
import ExclamationCircleEmptySvg from '../../../../../../../../public/assets/svg/exclamation-circle.svg';
import CheckboxInput from '../../../../../../components/ui-components/Form/CheckboxInput';

export default function TopicItem({
  checkboxId,
  data,
  expiredTopics,
  selectedTopicsId,
  handleSelect
}) {
  const { name, id, dateLastOpinion } = data;

  const isChecked = selectedTopicsId.includes(id);
  const isExpired = Array.isArray(expiredTopics) && expiredTopics.includes(id);
  const isFilled = !isExpired && dateLastOpinion;

  return (
    <li className="topic">
      <CheckboxInput
        name={checkboxId}
        labelText={name}
        className="topic-checkbox"
        withFill
        onChange={() => handleSelect(data)}
        checked={isChecked}
      />

      {isExpired && (
        <span className="topic-status red">
          <ExclamationCircleEmptySvg />
        </span>
      )}

      {isFilled && (
        <span className="topic-status green">
          <SuccessCircleSvg />
        </span>
      )}
    </li>
  );
}
