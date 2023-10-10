import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { resolveLatestProcessName, getProcess } from '../../transactions/transaction';

import css from './OrderBreakdown.module.css';

const LineItemService = props => {
  const { transaction, isProvider, intl, service } = props;
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

  const totalLabel = <FormattedMessage id="OrderBreakdown.service" />;

  const totalPrice = isProvider
    ? transaction.attributes.payoutTotal
    : transaction.attributes.payinTotal;
  const formattedTotalPrice = <FormattedMessage id={`OrderBreakdown.service.${service}`} />;

  return (
    <>
      <div className={css.lineItemTotal}>
        <div className={css.totalLabel}>{totalLabel}</div>
        <div className={css.totalPrice}>{formattedTotalPrice}</div>
      </div>
      <hr className={css.totalDivider} />
    </>
  );
};

LineItemService.propTypes = {
  transaction: propTypes.transaction.isRequired,
  isProvider: bool.isRequired,
  intl: intlShape.isRequired,
  service: string.isRequired,
};

export default LineItemService;
