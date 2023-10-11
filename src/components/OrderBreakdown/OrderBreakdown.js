/**
 * This component will show the booking info and calculated total price.
 * I.e. dates and other details related to payment decision in receipt format.
 */
import React, { useState } from 'react';
import { oneOf, string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import {
  propTypes,
  LISTING_UNIT_TYPES,
  LINE_ITEM_CUSTOMER_COMMISSION,
  LINE_ITEM_PROVIDER_COMMISSION,
} from '../../util/types';
import { SERVICE_RESCUE } from '../../config/configBookingService';

import LineItemBookingPeriod from './LineItemBookingPeriod';
import LineItemBasePriceMaybe from './LineItemBasePriceMaybe';
import LineItemSubTotalMaybe from './LineItemSubTotalMaybe';
import LineItemShippingFeeMaybe from './LineItemShippingFeeMaybe';
import LineItemPickupFeeMaybe from './LineItemPickupFeeMaybe';
import LineItemCustomerCommissionMaybe from './LineItemCustomerCommissionMaybe';
import LineItemCustomerCommissionRefundMaybe from './LineItemCustomerCommissionRefundMaybe';
import LineItemProviderCommissionMaybe from './LineItemProviderCommissionMaybe';
import LineItemProviderCommissionRefundMaybe from './LineItemProviderCommissionRefundMaybe';
import LineItemRefundMaybe from './LineItemRefundMaybe';
import LineItemTotalPrice from './LineItemTotalPrice';
import LineItemUnknownItemsMaybe from './LineItemUnknownItemsMaybe';
import LineItemService from './LineItemService';
import LineItemFormMaybe from './LineItemFormMaybe';

import css from './OrderBreakdown.module.css';

export const OrderBreakdownComponent = props => {
  const {
    rootClassName,
    className,
    userRole,
    transaction,
    booking,
    intl,
    dateType,
    timeZone,
    currency,
    marketplaceName,
  } = props;

  const { selectService } =
    (transaction?.attributes?.protectedData?.selectServiceInfo) || {};
  const isCustomer = userRole === 'customer';
  const isProvider = userRole === 'provider';
  const lineItems = transaction.attributes.lineItems;
  const unitLineItem = lineItems?.find(
    item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
  );
  // Line-item code that matches with base unit: day, night, hour, item
  const lineItemUnitType = unitLineItem?.code;

  const hasCommissionLineItem = lineItems.find(item => {
    const hasCustomerCommission = isCustomer && item.code === LINE_ITEM_CUSTOMER_COMMISSION;
    const hasProviderCommission = isProvider && item.code === LINE_ITEM_PROVIDER_COMMISSION;
    return (hasCustomerCommission || hasProviderCommission) && !item.reversal;
  });

  const classes = classNames(rootClassName || css.root, className);

  const index = lineItems.findIndex(item => item.code === lineItemUnitType && !item.reversal);
  const unitPurchase = index !== -1 ? lineItems[index] : null;
  const quantity = unitPurchase ? unitPurchase.quantity.toString() : null;

  const [newQuantity, setNewQuantity] = useState(quantity);

  lineItems[index].lineTotal.amount = unitPurchase ? unitPurchase.unitPrice.amount * newQuantity : null;
  const commission = lineItems[index].lineTotal.amount * lineItems[1].percentage.d / 100;
  const payin = lineItems[index].lineTotal.amount;
  const payout = payin - commission;

  /**
   * OrderBreakdown contains different line items:
   *
   * LineItemBookingPeriod: prints booking start and booking end types. Prop dateType
   * determines if the date and time or only the date is shown
   *
   * LineItemShippingFeeMaybe: prints the shipping fee (combining additional fee of
   * additional items into it).
   *
   * LineItemShippingFeeRefundMaybe: prints the amount of refunded shipping fee
   *
   * LineItemBasePriceMaybe: prints the base price calculation for the listing, e.g.
   * "$150.00 * 2 nights $300"
   *
   * LineItemUnknownItemsMaybe: prints the line items that are unknown. In ideal case there
   * should not be unknown line items. If you are using custom pricing, you should create
   * new custom line items if you need them.
   *
   * LineItemSubTotalMaybe: prints subtotal of line items before possible
   * commission or refunds
   *
   * LineItemRefundMaybe: prints the amount of refund
   *
   * LineItemCustomerCommissionMaybe: prints the amount of customer commission
   * The default transaction process used by this template doesn't include the customer commission.
   *
   * LineItemCustomerCommissionRefundMaybe: prints the amount of refunded customer commission
   *
   * LineItemProviderCommissionMaybe: prints the amount of provider commission
   *
   * LineItemProviderCommissionRefundMaybe: prints the amount of refunded provider commission
   *
   * LineItemTotalPrice: prints total price of the transaction
   *
   */

  return (
    <div className={classes}>
      <LineItemService
        service={selectService}
        intl={intl}
      />

      <LineItemBookingPeriod
        booking={booking}
        code={lineItemUnitType}
        dateType={dateType}
        timeZone={timeZone}
        service={selectService}
        isProvider={isProvider}
        quantity={newQuantity}
      />

      {selectService === SERVICE_RESCUE
        && isProvider
        && <LineItemBasePriceMaybe
          quantity={newQuantity}
          lineItems={lineItems}
          code={lineItemUnitType}
          intl={intl}
        />}

      <LineItemShippingFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemPickupFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemUnknownItemsMaybe lineItems={lineItems} isProvider={isProvider} intl={intl} />

      {selectService === SERVICE_RESCUE && <LineItemSubTotalMaybe
        lineItems={lineItems}
        code={lineItemUnitType}
        userRole={userRole}
        intl={intl}
        marketplaceCurrency={currency}
      />}

      <LineItemRefundMaybe lineItems={lineItems} intl={intl} marketplaceCurrency={currency} />

      {selectService === SERVICE_RESCUE
        && <LineItemCustomerCommissionMaybe
          lineItems={lineItems}
          isCustomer={isCustomer}
          marketplaceName={marketplaceName}
          intl={intl}
        />}

      <LineItemCustomerCommissionRefundMaybe
        lineItems={lineItems}
        isCustomer={isCustomer}
        marketplaceName={marketplaceName}
        intl={intl}
      />

      {selectService === SERVICE_RESCUE && <LineItemProviderCommissionMaybe
        lineItems={lineItems}
        isProvider={isProvider}
        marketplaceName={marketplaceName}
        intl={intl}
        currency={currency}
        commission={commission}
      />}

      <LineItemProviderCommissionRefundMaybe
        lineItems={lineItems}
        isProvider={isProvider}
        marketplaceName={marketplaceName}
        intl={intl}
      />

      {selectService === SERVICE_RESCUE
        && isProvider
        && <LineItemTotalPrice
          transaction={transaction}
          isProvider={isProvider}
          quantity={newQuantity}
          intl={intl}
          payin={payin}
          payout={payout}
          currency={currency}
        />}

      {hasCommissionLineItem && selectService === SERVICE_RESCUE ? (
        <span className={css.feeInfo}>
          <FormattedMessage id="OrderBreakdown.commissionFeeNote" />
        </span>
      ) : null}

      {isProvider && selectService === SERVICE_RESCUE &&
        <LineItemFormMaybe.component
          {...LineItemFormMaybe.props}
          setNewQuantity={setNewQuantity}
          quantity={quantity}
        />
      }
    </div>
  );
};

OrderBreakdownComponent.defaultProps = {
  rootClassName: null,
  className: null,
  booking: null,
  dateType: null,
};

OrderBreakdownComponent.propTypes = {
  rootClassName: string,
  className: string,

  marketplaceName: string.isRequired,
  userRole: oneOf(['customer', 'provider']).isRequired,
  transaction: propTypes.transaction.isRequired,
  booking: propTypes.booking,
  dateType: propTypes.dateType,

  // from injectIntl
  intl: intlShape.isRequired,
};

const OrderBreakdown = injectIntl(OrderBreakdownComponent);

OrderBreakdown.displayName = 'OrderBreakdown';

export default OrderBreakdown;
