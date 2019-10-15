import React from 'react';

import EditIcon from './infoBlock/EditIcon';
import CustomTextarea from '../../../components/ui-components/CustomTextarea';

class InfoBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isBlockEditing: false
    };

    this.toggleEdit = this.toggleEdit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isEdit) {
      this.setState({ isBlockEditing: false });
    }
  }

  toggleEdit() {
    this.setState((state) => ({
      isBlockEditing: !state.isBlockEditing
    }));
  }

  render() {
    const { isBlockEditing } = this.state;
    const { title, body, name, isEdit, onChange, errors, className } = this.props;

    if (isBlockEditing) {
      return (
        <div className={`info-block ${className || ''}`}>
          <EditIcon onClick={this.toggleEdit} />
          {typeof title === 'string' ? <h2 className="info-block__title">{title}</h2> : title}
          {typeof body === 'string' ? (
            <CustomTextarea name={name} value={body} onChange={onChange} error={errors[name]} />
          ) : (
            body(isBlockEditing)
          )}
        </div>
      );
    }

    return (
      <div className={`info-block ${className || ''}`}>
        {isEdit && <EditIcon onClick={this.toggleEdit} />}
        {typeof title === 'string' ? <h2 className="info-block__title">{title}</h2> : title}
        {typeof body === 'string' ? <p>{body || '—'}</p> : body(isBlockEditing)}
      </div>
    );
  }
}

export default InfoBlock;
