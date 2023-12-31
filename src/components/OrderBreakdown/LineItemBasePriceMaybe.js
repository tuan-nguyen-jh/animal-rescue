import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';

import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes, LINE_ITEM_HOUR } from '../../util/types';

import css from './OrderBreakdown.module.css';

const LineItemBasePriceMaybe = props => {
  const { lineItems, code, intl, quantity, estimatedLineItem } = props;
  const isNightly = code === LINE_ITEM_NIGHT;
  const isDaily = code === LINE_ITEM_DAY;
  const isHourly = code === LINE_ITEM_HOUR;
  const translationKey = isNightly
    ? 'OrderBreakdown.baseUnitNight'
    : isDaily
      ? 'OrderBreakdown.baseUnitDay'
      : isHourly
        ? 'OrderBreakdown.baseUnitHour'
        : 'OrderBreakdown.baseUnitQuantity';

  // Find correct line-item for given code prop.
  // It should be one of the following: 'line-item/night, 'line-item/day', 'line-item/hour', or 'line-item/item'
  // These are defined in '../../util/types';
  const unitPurchase = lineItems.find(item => item.code === code && !item.reversal);
  const [unitPrice, total] = unitPurchase ? [
    formatMoney(intl, unitPurchase.unitPrice),
    formatMoney(intl, unitPurchase.lineTotal)
  ] : [null, null];
  const displayQuantity = quantity || estimatedLineItem;

  return (quantity || estimatedLineItem) && total ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage
          id={translationKey}
          values={{ unitPrice, quantity: displayQuantity }}
        />
      </span>
      <span className={css.itemValue}>{total}</span>
    </div>
  ) : null;
};

LineItemBasePriceMaybe.propTypes = {
  lineItems: propTypes.lineItems.isRequired,
  code: propTypes.lineItemUnitType,
  intl: intlShape.isRequired,
};

export default LineItemBasePriceMaybe;
