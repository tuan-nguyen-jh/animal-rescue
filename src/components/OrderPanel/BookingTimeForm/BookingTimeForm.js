import classNames from 'classnames';
import { array, bool, func, number, object, string } from 'prop-types';
import React, { Component } from 'react';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { compose } from 'redux';

import { timestampToDate } from '../../../util/dates';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';
import { required } from '../../../util/validators';

import { FieldSelect, Form, PrimaryButton } from '../../../components';

import FieldDateAndTimeInput from './FieldDateAndTimeInput';

import css from './BookingTimeForm.module.css';

export class BookingTimeFormComponent extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleFormSubmit(e) {
    this.props.onSubmit(e);
  }

  // When the values of the form are updated we need to fetch
  // lineItems from this template's backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the orderData object.
  handleOnChange(formValues) {
    const { bookingStartTime, bookingEndTime } = formValues.values;
    const startDate = bookingStartTime ? timestampToDate(bookingStartTime) : null;
    const endDate = bookingEndTime ? timestampToDate(bookingEndTime) : null;

    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;

    // Note: we expect values bookingStartTime and bookingEndTime to be strings
    // which is the default case when the value has been selected through the form
    const isStartBeforeEnd = bookingStartTime < bookingEndTime;

    if (
      bookingStartTime &&
      bookingEndTime &&
      isStartBeforeEnd &&
      !this.props.fetchLineItemsInProgress
    ) {
      this.props.onFetchTransactionLineItems({
        orderData: { bookingStart: startDate, bookingEnd: endDate },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const {
      rootClassName,
      className,
      price: unitPrice,
      dayCountAvailableForBooking,
      marketplaceName,
      ...rest
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            endDatePlaceholder,
            startDatePlaceholder,
            form,
            pristine,
            handleSubmit,
            intl,
            isOwnListing,
            listingId,
            service,
            values,
            monthlyTimeSlots,
            onFetchTimeSlots,
            timeZone,
            fetchLineItemsInProgress,
            fetchLineItemsError,
          } = fieldRenderProps;


          return (
            <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />
              {monthlyTimeSlots && timeZone ? (
                <FieldDateAndTimeInput
                  startDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingStartTitle' }),
                    placeholderText: startDatePlaceholder,
                  }}
                  endDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingEndTitle' }),
                    placeholderText: endDatePlaceholder,
                  }}
                  className={css.bookingDates}
                  listingId={listingId}
                  onFetchTimeSlots={onFetchTimeSlots}
                  monthlyTimeSlots={monthlyTimeSlots}
                  values={values}
                  intl={intl}
                  form={form}
                  pristine={pristine}
                  timeZone={timeZone}
                  dayCountAvailableForBooking={dayCountAvailableForBooking}
                />
              ) : null}

              {fetchLineItemsError ? (
                <span className={css.sideBarError}>
                  <FormattedMessage id="BookingTimeForm.fetchLineItemsError" />
                </span>
              ) : null}

              <hr className={css.totalDivider} />

              <FieldSelect
                id="select-service"
                name="select-servcie"
                label={intl.formatMessage({id:"BookingTimeForm.serviceLabel"})}
                validate={required(intl.formatMessage({id:"BookingTimeForm.serviceRequired"}))}
              >
                <option disabled value="">{intl.formatMessage({id:"BookingTimeForm.servicePlaceholder"})}</option>
                {service.map((value, index) => <option key={index} value={value}>{value.toUpperCase()}</option>)}
              </FieldSelect>

              <div className={css.submitButton}>
                <PrimaryButton type="submit" inProgress={fetchLineItemsInProgress}>
                  <FormattedMessage id="BookingTimeForm.requestToBook" />
                </PrimaryButton>
              </div>

              <p className={css.finePrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingTimeForm.ownListing'
                      : 'BookingTimeForm.youWontBeChargedInfo'
                  }
                />
              </p>
            </Form>
          );
        }}
      />
    );
  }
}

BookingTimeFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  price: null,
  isOwnListing: false,
  listingId: null,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  monthlyTimeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingTimeFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  marketplaceName: string.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  listingId: propTypes.uuid,
  monthlyTimeSlots: object,
  onFetchTimeSlots: func.isRequired,
  timeZone: string.isRequired,

  onFetchTransactionLineItems: func.isRequired,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,

  dayCountAvailableForBooking: number.isRequired,

  service: array,
};

const BookingTimeForm = compose(injectIntl)(BookingTimeFormComponent);
BookingTimeForm.displayName = 'BookingTimeForm';

export default BookingTimeForm;
