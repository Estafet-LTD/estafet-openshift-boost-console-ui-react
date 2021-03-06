import { Box, Flex } from '@rebass/grid';
import debounce from 'debounce';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';

import Controls from '../../components/Controls/Controls';
import DataFallback from '../../components/DataFallback/DataFallback';
import Input from '../../components/Input/Input';
import LastUpdated from '../../components/LastUpdated/LastUpdated';
import Loader from '../../components/Loader/Loader';
import PageHeading from '../../components/PageHeading/PageHeading';
import { DEBOUNCE_DELAY } from '../../constants';
import microservicesType from '../../types/microservices';
import ToastService from '../../utils/ToastService';
import t from '../../utils/translate';
import MicroservicesApplications from './MicroservicesApplications';
import {
  searchMicroservices as searchMicroservicesAction,
  startPollingMicroservices,
  stopPollingMicroservices,
} from './state/actions';
import { getMicroservicesSelector } from './state/selectors';

const mapStateToProps = (state) => ({
  data: getMicroservicesSelector(state),
  loading: state.microservices.loading,
  polling: state.microservices.polling,
  searchQuery: state.microservices.searchQuery,
});

const mapDispatchToProps = (dispatch) => ({
  startPolling: () => dispatch(startPollingMicroservices()),
  stopPolling: () => dispatch(stopPollingMicroservices()),
  searchMicroservices: (searchQuery) => dispatch(searchMicroservicesAction(searchQuery)),
});

@connect(mapStateToProps, mapDispatchToProps)
class Microservices extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: props.searchQuery,
    };

    this.debounceSearch = debounce(this.debounceSearch, DEBOUNCE_DELAY);
  }

  componentDidMount() {
    const { startPolling } = this.props;
    startPolling();
  }

  componentWillUnmount() {
    const { stopPolling } = this.props;
    stopPolling();
  }

  // Temporary restarting the polling in order to update the loading state of the actions
  handleStateChange = async (actionTitle, actionFn, ...params) => {
    const { startPolling, stopPolling } = this.props;
    const action = actionTitle.toLowerCase();
    const toastId = ToastService.info(t('common.action.pending', { action }));

    try {
      await actionFn(...params);
      ToastService.success(t('common.action.success', { action }));
    } finally {
      ToastService.dismiss(toastId);
    }

    stopPolling();
    startPolling();
  };

  handleSearchChange = (event) => {
    this.setState(
      {
        searchQuery: event.target.value,
      },
      this.debounceSearch
    );
  };

  debounceSearch = () => {
    const { searchQuery } = this.state;
    const { searchMicroservices } = this.props;
    searchMicroservices(searchQuery);
  };

  render() {
    const { searchQuery } = this.state;
    const { data, loading, polling } = this.props;
    const { count, lastUpdated } = polling;

    if (loading && !count) return <Loader />;
    if (data && !data.length) return <DataFallback title={t('microservices.dataFallback')} />;

    return (
      <>
        <Helmet title={t('microservices.pageTitle')} />
        <PageHeading title={t('microservices.pageTitle')}>
          <Input
            value={searchQuery}
            placeholder={t('microservices.searchPlaceholder')}
            onChange={this.handleSearchChange}
          />
        </PageHeading>
        <Controls data={data} itemAccessor='apps' onStateChange={this.handleStateChange} />
        <Flex mt={3} flexDirection='column-reverse'>
          <Box px={2}>{lastUpdated && <LastUpdated date={lastUpdated} loading={loading} />}</Box>
        </Flex>
        <MicroservicesApplications data={data} onStateChange={this.handleStateChange} />
      </>
    );
  }
}

Microservices.propTypes = {
  data: microservicesType,
  loading: PropTypes.bool,
  polling: PropTypes.shape({
    count: PropTypes.number,
    lastUpdated: PropTypes.instanceOf(Date),
  }),
  searchQuery: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  startPolling: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  stopPolling: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  searchMicroservices: PropTypes.func,
};

Microservices.defaultProps = {
  data: [],
  loading: true,
  polling: {},
  searchQuery: '',
};

export default Microservices;
