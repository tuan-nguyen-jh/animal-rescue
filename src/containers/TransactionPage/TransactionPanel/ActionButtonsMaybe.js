import React from 'react';
import classNames from 'classnames';

import { PrimaryButton, SecondaryButton } from '../../../components';

import css from './TransactionPanel.module.css';
import { transitions } from '../../../transactions/transactionProcessRescueBooking';
import { transitionPrivileged } from '../../../util/api';

// Functional component as a helper to build ActionButtons
const ActionButtonsMaybe = props => {
  const {
    className,
    rootClassName,
    showButtons,
    primaryButtonProps,
    secondaryButtonProps,
    isListingDeleted,
    isProvider,
    estimatedLineItem,
    onTransition,
    transaction,
  } = props;

  // In default processes default processes need special handling
  // Booking: provider should not be able to accept on-going transactions
  // Product: customer should be able to dispute etc. on-going transactions
  if (isListingDeleted && isProvider) {
    return null;
  }

  const hanldeClick = () => {
    const params = {};

    const txId = transaction.id.uuid;

    switch (transaction.attributes.lastTransition) {
      case transitions.ACCEPT:
        onTransition(txId, transitions.CONFIRM_REQUEST, params);
        break;
      case transitions.CONFIRM_REQUEST:
        onTransition(txId, transitions.FINISH, params);
        break;
      case transitions.FINISH:
        onTransition(txId, transitions.REQUEST_PAYMENT, params);
        break;
      default:
        params.protectedData = {
          estimatedLineItem
        };
        onTransition(txId, transitions.ACCEPT, params);
    }

  }

  const buttonsDisabled = primaryButtonProps?.inProgress || secondaryButtonProps?.inProgress;

  const primaryButton = primaryButtonProps ? (
    <PrimaryButton
      inProgress={primaryButtonProps.inProgress}
      disabled={buttonsDisabled}
      onClick={hanldeClick}
    >
      {primaryButtonProps.buttonText}
    </PrimaryButton>
  ) : null;
  const primaryErrorMessage = primaryButtonProps?.error ? (
    <p className={css.actionError}>{primaryButtonProps?.errorText}</p>
  ) : null;

  const secondaryButton = secondaryButtonProps ? (
    <SecondaryButton
      inProgress={secondaryButtonProps?.inProgress}
      disabled={buttonsDisabled}
      onClick={secondaryButtonProps.onAction}
    >
      {secondaryButtonProps.buttonText}
    </SecondaryButton>
  ) : null;
  const secondaryErrorMessage = secondaryButtonProps?.error ? (
    <p className={css.actionError}>{secondaryButtonProps?.errorText}</p>
  ) : null;

  const classes = classNames(rootClassName || css.actionButtons, className);

  return showButtons ? (
    <div className={classes}>
      <div className={css.actionErrors}>
        {primaryErrorMessage}
        {secondaryErrorMessage}
      </div>
      <div className={css.actionButtonWrapper}>
        {secondaryButton}
        {primaryButton}
      </div>
    </div>
  ) : null;
};

export default ActionButtonsMaybe;
