import React from 'react';
import classNames from 'classnames';

import { addTime } from '../../../util/dates';
import { transitions } from '../../../transactions/transactionProcessRescueBooking';

import { PrimaryButton, SecondaryButton } from '../../../components';

import { SERVICE_RESCUE } from '../../../config/configBookingService';

import css from './TransactionPanel.module.css';

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
    onUpdateTxDetails,
    isRescueService,
  } = props;

  const handleUpdateLineItems = async (values, listing, transitionName) => {
    const {
      bookingDates,
      quantity: quantityRaw,
      ...otherOrderData
    } = values;

    const bookingMaybe = bookingDates
      ? {
        bookingDates: {
          bookingStart: bookingDates.startDate,
          bookingEnd: bookingDates.endDate,
        },
      }
      : {};
    const quantity = Number.parseInt(quantityRaw, 10);
    const quantityMaybe = Number.isInteger(quantity) ? { quantity } : {};

    const orderData = {
      ...bookingMaybe,
      ...quantityMaybe,
      ...otherOrderData
    };

    const txId = await onUpdateTxDetails(listing, orderData, transitionName);
  };

  // In default processes default processes need special handling
  // Booking: provider should not be able to accept on-going transactions
  // Product: customer should be able to dispute etc. on-going transactions
  if (isListingDeleted && isProvider) {
    return null;
  }

  const hanldeClick = () => {
    const params = {};

    const txId = transaction.id.uuid;
    const { listing } = transaction;

    const values = {
      bookingDates: {
        startDate: transaction.booking.attributes.start,
        endDate: addTime(
          transaction.booking.attributes.start,
          estimatedLineItem,
          'hours'
        )
      },
      quantity: estimatedLineItem,
      protectedData: transaction.attributes.protectedData,
      txId
    }

    switch (transaction.attributes.lastTransition) {
      case transitions.ACCEPT:
        onTransition(txId, transitions.CONFIRM_REQUEST, params);
        break;
      case transitions.CONFIRM_REQUEST:
        handleUpdateLineItems(values, listing, transitions.FINISH);
        window.location.reload();
        break;
      case transitions.FINISH:
        params.bodyParams = {
          bookingDates: values.bookingDates,
        }
        onTransition(txId, transitions.REQUEST_PAYMENT, params);
        break;
      default:
        handleUpdateLineItems(values, listing, transitions.ACCEPT);
        window.location.reload();
    }
  }

  const buttonsDisabled = primaryButtonProps?.inProgress || secondaryButtonProps?.inProgress;
  const paymentIsCompleted = transaction.attributes.transitions.find(
    item => item.transition === transitions.CONFIRM_PAYMENT
  );

  const primaryButton = primaryButtonProps ? (
    <PrimaryButton
      inProgress={primaryButtonProps.inProgress}
      disabled={buttonsDisabled}
      onClick={isRescueService && !paymentIsCompleted ?
        hanldeClick : primaryButtonProps.onAction}
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
