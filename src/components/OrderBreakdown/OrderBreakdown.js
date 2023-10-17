/**
 * This component will show the booking info and calculated total price.
 * I.e. dates and other details related to payment decision in receipt format.
 */
import React, { useState } from 'react';
import { oneOf, string, bool } from 'prop-types';
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

import { ACC_SERVICES } from '../../config/configListing';

import css from './OrderBreakdown.module.css';
import { transitions } from '../../transactions/transactionProcessRescueBooking';

const Decimal = require('decimal.js');
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

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
    showLineItemForm,
    showPriceBreakdown,
    lineItemIsEstimated,
    newQuantity,
    setNewQuantity,
  } = props;

  const isCustomer = userRole === 'customer';
  const isProvider = userRole === 'provider';
  const lineItems = transaction.attributes.lineItems;
  const unitLineItem = lineItems?.find(
    item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
  );
  // Line-item code that matches with base unit: day, night, hour, item
  const lineItemUnitType = unitLineItem?.code;
  const service = transaction.attributes.protectedData.selectedService;
  const estimatedLineItem = service == SERVICE_RESCUE ?
    transaction.attributes.protectedData.estimatedLineItem : null;

  const hasCommissionLineItem = lineItems.find(item => {
    const hasCustomerCommission = isCustomer && item.code === LINE_ITEM_CUSTOMER_COMMISSION;
    const hasProviderCommission = isProvider && item.code === LINE_ITEM_PROVIDER_COMMISSION;
    return (hasCustomerCommission || hasProviderCommission) && !item.reversal;
  });

  const classes = classNames(rootClassName || css.root, className);

  const index = lineItems.findIndex(item => item.code === lineItemUnitType && !item.reversal);
  const unitPurchase = index !== -1 ? lineItems[index] : null;
  const quantity = unitPurchase ? unitPurchase.quantity.toString() : null;
  const lastTransition = transaction.attributes.lastTransition;

  if (lineItemIsEstimated
    && (
      lastTransition !== transitions.CONFIRM_REQUEST
      || !isProvider
    )) {
    lineItems[index].lineTotal = unitPurchase ?
      new Money(unitPurchase.unitPrice.amount * estimatedLineItem, currency) : null;
    lineItems[index].quantity = new Decimal(estimatedLineItem);
  } else if ([
    transitions.REQUEST_BOOKING,
    transitions.REQUEST_AFTER_INQUIRY,
    transitions.CONFIRM_REQUEST
  ].includes(lastTransition)) {
    lineItems[index].lineTotal = unitPurchase ?
      new Money(unitPurchase.unitPrice.amount * newQuantity, currency) : null;
    lineItems[index].quantity = new Decimal(newQuantity ? newQuantity : quantity);
  }

  const commission = service === SERVICE_RESCUE ?
    lineItems[index].lineTotal.amount * lineItems[1].percentage.d / 100 : null;
  const payin =  service === SERVICE_RESCUE ? lineItems[index].lineTotal.amount : null;
  const payout = payin? payin - commission : null;
  if (service === SERVICE_RESCUE){
    transaction.attributes.payinTotal = new Money(payin, currency);
    transaction.attributes.payoutTotal = new Money(payout, currency);
  }
  

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
        service={service}
        intl={intl}
      />

      <LineItemBookingPeriod
        booking={booking}
        code={lineItemUnitType}
        dateType={dateType}
        timeZone={timeZone}
        service={service}
        isProvider={isProvider}
        showPriceBreakdown={showPriceBreakdown}
        quantity={newQuantity}
        estimatedLineItem={estimatedLineItem}
        lineItemIsEstimated={lineItemIsEstimated}
      />

      {service === SERVICE_RESCUE
        && (isProvider || lineItemIsEstimated)
        && showPriceBreakdown
        && <LineItemBasePriceMaybe
          quantity={newQuantity}
          lineItems={lineItems}
          code={lineItemUnitType}
          intl={intl}
          estimatedLineItem={estimatedLineItem}
        />
      }

      <LineItemShippingFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemPickupFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemUnknownItemsMaybe lineItems={lineItems} isProvider={isProvider} intl={intl} />

      {service === SERVICE_RESCUE
        && showPriceBreakdown
        && <LineItemSubTotalMaybe
          lineItems={lineItems}
          code={lineItemUnitType}
          userRole={userRole}
          intl={intl}
          marketplaceCurrency={currency}
          estimatedLineItem={estimatedLineItem}
        />
      }

      <LineItemRefundMaybe lineItems={lineItems} intl={intl} marketplaceCurrency={currency} />

      {service === SERVICE_RESCUE
        && showPriceBreakdown
        && <LineItemCustomerCommissionMaybe
          lineItems={lineItems}
          isCustomer={isCustomer}
          marketplaceName={marketplaceName}
          intl={intl}
          estimatedLineItem={estimatedLineItem}
        />
      }

      <LineItemCustomerCommissionRefundMaybe
        lineItems={lineItems}
        isCustomer={isCustomer}
        marketplaceName={marketplaceName}
        intl={intl}
      />

      {service === SERVICE_RESCUE
        && showPriceBreakdown
        && <LineItemProviderCommissionMaybe
          lineItems={lineItems}
          isProvider={isProvider}
          marketplaceName={marketplaceName}
          intl={intl}
          currency={currency}
          commission={commission}
        />
      }

      <LineItemProviderCommissionRefundMaybe
        lineItems={lineItems}
        isProvider={isProvider}
        marketplaceName={marketplaceName}
        intl={intl}
      />

      {service === SERVICE_RESCUE
        && (isProvider || lineItemIsEstimated)
        && showPriceBreakdown
        && <LineItemTotalPrice
          transaction={transaction}
          isProvider={isProvider}
          intl={intl}
          payin={payin}
          payout={payout}
          currency={currency}
        />
      }

      {hasCommissionLineItem
        && service === SERVICE_RESCUE
        && showPriceBreakdown ? (
        <span className={css.feeInfo}>
          <FormattedMessage id="OrderBreakdown.commissionFeeNote" />
        </span>
      ) : null}

      {isProvider && service === SERVICE_RESCUE && showLineItemForm &&
        <LineItemFormMaybe.component
          {...LineItemFormMaybe.props}
          showLineItemForm
          setNewQuantity={setNewQuantity}
          quantity={lineItemIsEstimated ? estimatedLineItem : quantity}
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
