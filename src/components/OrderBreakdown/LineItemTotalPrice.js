import React from 'react';
import { bool, string, number } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { propTypes } from '../../util/types';
import { types as sdkTypes } from '../../util/sdkLoader';
import { resolveLatestProcessName, getProcess } from '../../transactions/transaction';

import css from './OrderBreakdown.module.css';

const LineItemTotalPrice = props => {
  const { Money } = sdkTypes;
  const { transaction, isProvider, intl, payin, payout, currency } = props;
  const processName = resolveLatestProcessName(transaction?.attributes?.processName);
  if (!processName) {
    return null;
  }
  const process = getProcess(processName);
  const isCompleted = process.isCompleted(transaction?.attributes?.lastTransition);
  const isRefunded = process.isRefunded(transaction?.attributes?.lastTransition);

  let providerTotalMessageId = 'OrderBreakdown.providerTotalDefault';
  if (isCompleted) {
    providerTotalMessageId = 'OrderBreakdown.providerTotalReceived';
  } else if (isRefunded) {
    providerTotalMessageId = 'OrderBreakdown.providerTotalRefunded';
  }

  const totalLabel = isProvider ? (
    <FormattedMessage id={providerTotalMessageId} />
  ) : (
    <FormattedMessage id="OrderBreakdown.total" />
  );

  const totalPrice = isProvider
    ? new Money(payout, currency)
    : new Money(payin, currency);
  const formattedTotalPrice = formatMoney(intl, totalPrice);

  return (
    <>
      <hr className={css.totalDivider} />
      <div className={css.lineItemTotal}>
        <div className={css.totalLabel}>{totalLabel}</div>
        <div className={css.totalPrice}>{formattedTotalPrice}</div>
      </div>
    </>
  );
};

LineItemTotalPrice.propTypes = {
  transaction: propTypes.transaction.isRequired,
  isProvider: bool.isRequired,
  intl: intlShape.isRequired,
  currency: string.isRequired,
  payin: number,
  payout: number
};

export default LineItemTotalPrice;
