import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage, intlShape, injectIntl } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';
import { Modal } from '../../../components';

import css from './HostInformationModal.module.css';
import HostInformationForm from '../HostInformationForm/HostInformationForm';

const HostInformationModal = props => {
  const {
    className,
    rootClassName,
    id,
    marketplaceName,
    intl,
    isOpen,
    onCloseModal,
    onManageDisableScrolling,
    onSubmitHostInfo,
    hostInfoSent,
    sendHostInfoInProgress,
    sendHostInfoError,
    listing,
    listingAnimals,
    onFetchAnimalListing,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const closeButtonMessage = intl.formatMessage({ id: 'HostInfoModal.later' });

  useEffect(() => {
    onFetchAnimalListing(listing.id?.uuid)
  }, [listing.id?.uuid])

  return (
    <Modal
      id={id}
      containerClassName={classes}
      contentClassName={css.modalContent}
      isOpen={isOpen}
      onClose={onCloseModal}
      onManageDisableScrolling={onManageDisableScrolling}
      usePortal
      closeButtonMessage={closeButtonMessage}
    >
      <p className={css.modalTitle}>
        <FormattedMessage id="HostInformationModal.title"/>
      </p>
      <p className={css.modalMessage}>
        <FormattedMessage id="HostInformationModal.description" values={{ marketplaceName }} />
      </p>
      <HostInformationForm
        onSubmit={values => {
          const { animal, hostName, hostPhone, date } = values;
          const updatedValues = {
            animal, hostName, hostPhone, date
          }
          onSubmitHostInfo(updatedValues)
        }
        }
        hostInfoSent={hostInfoSent}
        listingAnimals={listingAnimals}
        sendHostInfoInProgress={sendHostInfoInProgress}
        sendHostInfoError={sendHostInfoError}
      />
    </Modal>
  );
};

const { bool, string } = PropTypes;

HostInformationModal.defaultProps = {
  className: null,
  rootClassName: null,
  hostInfoSent: false,
  sendHostInfoInProgress: false,
  sendHostInfoError: null,
  listing: []
};

HostInformationModal.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  hostInfoSent: bool,
  sendHostInfoInProgress: bool,
  sendHostInfoError: propTypes.error,
  marketplaceName: string.isRequired,
};

export default injectIntl(HostInformationModal);
