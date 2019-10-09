import React from 'react';
import { connect } from 'react-redux';
import BlockWrapper from '../BlockWrapper';
import SatisfiedClients from '../../profile/overview/SatisfiedClients';
import managerSelectors from '../../../modules/manager/managerSelectors';
import { LoaderBlock } from '../../../components/ui-components/Layout/Loader';

function SatisfiedClientsContainer({ status, data }) {
  if (status === 'failure') {
    return null;
  }

  return (
    <BlockWrapper>
      {status === 'request' ? (
        <LoaderBlock height="20vh" />
      ) : (
        <SatisfiedClients satisfiedClients={data} />
      )}
    </BlockWrapper>
  );
}

const mapStateToProps = (state, props) => {
  const { match } = props;
  const {
    params: { id }
  } = match;
  const { status, data } = managerSelectors.satisfaction(state);

  return { status, data, id };
};

export default connect(mapStateToProps)(SatisfiedClientsContainer);
