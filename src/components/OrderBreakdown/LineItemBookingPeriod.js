import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, FormattedDate } from '../../util/reactIntl';
import { LINE_ITEM_NIGHT, DATE_TYPE_DATE, LINE_ITEM_HOUR, propTypes } from '../../util/types';
import { addTime, subtractTime } from '../../util/dates';

import css from './OrderBreakdown.module.css';
import { SERVICE_RESCUE } from '../../config/configBookingService';

const BookingPeriod = props => {
  const { startDate,
    endDate,
    dateType,
    timeZone,
    isProvider,
    service,
    showPriceBreakdown
  } = props;
  const timeZoneMaybe = timeZone ? { timeZone } : null;

  const timeFormatOptions =
    dateType === DATE_TYPE_DATE
      ? {
        weekday: 'long',
      }
      : {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      };

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  return (
    <>
      <div className={css.bookingPeriod}>
        <div className={css.bookingPeriodSectionLeft}>
          <div className={css.dayLabel}>
            <FormattedMessage id="OrderBreakdown.bookingStart" />
          </div>
          <div className={css.dayInfo}>
            <FormattedDate value={startDate} {...timeFormatOptions} {...timeZoneMaybe} />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={startDate} {...dateFormatOptions} {...timeZoneMaybe} />
          </div>
        </div>

        <div className={css.bookingPeriodSectionRight}>
          <div className={css.dayLabel}>
            <FormattedMessage id="OrderBreakdown.bookingEnd" />
          </div>
          <div className={css.dayInfo}>
            {(isProvider || service !== SERVICE_RESCUE) && showPriceBreakdown ?
              <FormattedDate value={endDate} {...timeFormatOptions} {...timeZoneMaybe} />
              : <FormattedMessage id="OrderBreakdown.bookingEnd.dayTimePlaceholder" />}
          </div>
          <div className={css.itemLabel}>
            {(isProvider || service !== SERVICE_RESCUE) && showPriceBreakdown ?
              <FormattedDate value={endDate} {...dateFormatOptions} {...timeZoneMaybe} />
              : <FormattedMessage id="OrderBreakdown.bookingEnd.monthYearPlaceholder" />}
          </div>
        </div>
      </div>
    </>
  );
};

const LineItemBookingPeriod = props => {
  const { booking, code, dateType, timeZone, service, isProvider, quantity, showPriceBreakdown } = props;

  if (!booking) {
    return null;
  }
  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  const { start, displayStart } = booking.attributes;
  const localStartDate = displayStart || start;

  const isNightly = code === LINE_ITEM_NIGHT;
  const isHour = code === LINE_ITEM_HOUR;
  const localEstimatedEndTime = addTime(localStartDate, quantity, 'hours');
  const endDay = isNightly || isHour
    ? localEstimatedEndTime : subtractTime(localEstimatedEndTime, 1, 'days');

  return (
    <>
      <div className={css.lineItem}>
        <BookingPeriod
          startDate={localStartDate}
          endDate={endDay}
          dateType={dateType}
          timeZone={timeZone}
          service={service}
          isProvider={isProvider}
          showPriceBreakdown={showPriceBreakdown}
        />
      </div>
      {service === SERVICE_RESCUE
        && isProvider
        && showPriceBreakdown
        && <hr className={css.totalDivider} />}
    </>
  );
};
LineItemBookingPeriod.defaultProps = { booking: null, dateType: null };

LineItemBookingPeriod.propTypes = {
  isProvider: bool.isRequired,
  booking: propTypes.booking,
  dateType: propTypes.dateType,
};

export default LineItemBookingPeriod;
