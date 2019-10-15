/* eslint-disable */
import React from 'react';
import CheckboxInput from '../../../components/ui-components/Form/CheckboxInput';
import ErrorSvg from '../../../../../public/assets/svg/exclamation-circle.svg';
// import RoleSelect from './RoleSelect';
import Notification from '../../../utils/notifications';
import StatusLabel from './StatusLabel';
import ManagerSelect from './ManagerSelect';

const handleNotify = (field, errors) => Notification.info(errors[field]);

const ErrorCircle = ({ field, errors }) => {
  if (errors[field]) {
    return (
      <span className="error-notify" onClick={() => handleNotify(field, errors)}>
        <ErrorSvg />
      </span>
    );
  }

  return null;
};

export default function InputRow({ table, errors = {}, data, handleEdit, onlyDropEdit }) {
  const { id, firstName, lastName, email, isChecked, status, _changes = {} } = data;

  const withErrors = Object.keys(errors).length;

  // if you want to control input in realtime use value and onChange

  return (
    <li className={`row ${withErrors ? 'withErrors' : ''} ${isChecked ? 'checked' : ''}`}>
      <div className={`item item-check ${errors.firstName ? 'error' : ''}`}>
        <CheckboxInput
          name={id}
          withFill
          onlyCheck
          onChange={handleEdit}
          data-id={id}
          checked={isChecked}
          data-field="isChecked"
        />
      </div>
      {onlyDropEdit ? (
        <>
          <div className="item item-name">{firstName}</div>
          <div className="item item-surname">{lastName}</div>
          <div className="item item-email">{email}</div>
        </>
      ) : (
        <>
          <div className={`item item-name ${errors.firstName ? 'error' : ''}`}>
            <input
              type="text"
              defaultValue={_changes.firstName || firstName}
              data-id={id}
              data-field="firstName"
              onBlur={handleEdit}
            />
            <ErrorCircle field="firstName" errors={errors} />
          </div>
          <div className={`item item-surname ${errors.lastName ? 'error' : ''}`}>
            <input
              type="text"
              defaultValue={_changes.lastName || lastName}
              data-id={id}
              data-field="lastName"
              onBlur={handleEdit}
            />
            <ErrorCircle field="lastName" errors={errors} />
          </div>
          <div className={`item item-email ${errors.email ? 'error' : ''}`}>
            <input
              type="text"
              defaultValue={_changes.email || email}
              data-id={id}
              data-field="email"
              onBlur={handleEdit}
            />
            <ErrorCircle field="email" errors={errors} />
          </div>
        </>
      )}

      <div className={`item item-manager drop ${errors.manager ? 'error' : ''}`}>
        <ManagerSelect rowId={id} table={table} />
        <ErrorCircle field="manager" errors={errors} />
      </div>

      <div className="item item-status">
        <StatusLabel status={status} />
      </div>
    </li>
  );
}
