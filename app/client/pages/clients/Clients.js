import React from 'react';
import { connect } from 'react-redux';
import { fetchClientsTables, clearAll } from '../../modules/clients/clientsActions';
import clientsSelectors from '../../modules/clients/clientsSelectors';
import { LoaderBlock } from '../../components/ui-components/Layout/Loader';
import InvitationTable from './invitationTable/InvitationTable';
import ClientTable from './clientTable/clientTable';

class Clients extends React.Component {
  componentDidMount() {
    const { fetchClientsTables } = this.props;
    fetchClientsTables();
  }

  componentWillUnmount() {
    const { clearAll } = this.props;
    clearAll();
  }

  render() {
    const { tableStatus } = this.props;

    if (tableStatus === 'request') {
      return (
        <div className="content staff">
          <LoaderBlock />
        </div>
      );
    }

    return (
      <div className="staff">
        <section className="table-list">
          <InvitationTable />
          <ClientTable />
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tableStatus: clientsSelectors.tableStatus(state)
});

const mapDispatchToProps = {
  fetchClientsTables,
  clearAll
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Clients);
