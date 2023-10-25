import {
  TX_TRANSITION_ACTOR_CUSTOMER as CUSTOMER,
  TX_TRANSITION_ACTOR_PROVIDER as PROVIDER,
  CONDITIONAL_RESOLVER_WILDCARD,
  ConditionalResolver,
} from '../../transactions/transaction';

/**
 * Get state data against booking process for TransactionPage's UI.
 * I.e. info about showing action buttons, current state etc.
 *
 * @param {*} txInfo detials about transaction
 * @param {*} processInfo  details about process
 */
export const getStateDataForRescueBookingProcess = (txInfo, processInfo) => {
  const { transaction, transactionRole, nextTransitions } = txInfo;
  const isProviderBanned = transaction?.provider?.attributes?.banned;
  const isCustomerBanned = transaction?.provider?.attributes?.banned;
  const _ = CONDITIONAL_RESOLVER_WILDCARD;

  const {
    processName,
    processState,
    states,
    transitions,
    isCustomer,
    actionButtonProps,
    leaveReviewProps,
  } = processInfo;

  return new ConditionalResolver([processState, transactionRole])
    .cond([states.INQUIRY, CUSTOMER], () => {
      const transitionNames = Array.isArray(nextTransitions)
        ? nextTransitions.map(t => t.attributes.name)
        : [];
      const requestAfterInquiry = transitions.REQUEST_AFTER_INQUIRY;
      const hasCorrectNextTransition = transitionNames.includes(requestAfterInquiry);
      const showOrderPanel = !isProviderBanned && hasCorrectNextTransition;
      return { processName, processState, showOrderPanel };
    })
    .cond([states.INQUIRY, PROVIDER], () => {
      return { processName, processState, showDetailCardHeadings: true };
    })
    .cond([states.BOOKING_REQUEST_SENT, CUSTOMER], () => {
      const secondary = actionButtonProps(transitions.CUSTOMER_DECLINE, CUSTOMER);
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showExtraInfo: true,
        secondaryButtonProps: secondary,
        showActionButtons: true,
        showLineItemForm: false,
      };
    })
    .cond([states.BOOKING_REQUEST_SENT, PROVIDER], () => {
      const primary = isCustomerBanned ? null : actionButtonProps(transitions.ACCEPT, PROVIDER);
      const secondary = isCustomerBanned ? null : actionButtonProps(transitions.PROVIDER_DECLINE, PROVIDER);
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showActionButtons: true,
        primaryButtonProps: primary,
        secondaryButtonProps: secondary,
        showLineItemForm: true,
        showPriceBreakdown: true
      };
    })
    .cond([states.REQUEST_DECLINED, _], () => {
      return {
        processName,
        processState,
        showPriceBreakdown: false,
        showLineItemForm: false,
      }
    })
    .cond([states.REQUEST_ACCEPTED, PROVIDER], () => {
      const secondary = isCustomerBanned ? null : actionButtonProps(transitions.PROVIDER_CANCEL, PROVIDER);
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        showActionButtons: true,
        secondaryButtonProps: secondary,
      }
    })
    .cond([states.REQUEST_ACCEPTED, CUSTOMER], () => {
      const primary = isCustomerBanned ? null : actionButtonProps(transitions.CONFIRM_REQUEST, CUSTOMER);
      const secondary = isCustomerBanned ? null : actionButtonProps(transitions.CUSTOMER_CANCEL, CUSTOMER);
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        primaryButtonProps: primary,
        secondaryButtonProps: secondary,
        showActionButtons: true,
        lineItemIsEstimated: true
      }
    })
    .cond([states.OFFICER_DISPATCHED, PROVIDER], () => {
      const primary = isCustomerBanned ? null : actionButtonProps(transitions.FINISH, PROVIDER);
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        primaryButtonProps: primary,
        showActionButtons: true,
        showLineItemForm: true,
        lineItemIsEstimated: true,
      }
    })
    .cond([states.OFFICER_DISPATCHED, CUSTOMER], () => {
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        lineItemIsEstimated: true
      }
    })
    .cond([states.EXACT_FEE_CALCULATED, PROVIDER], () => {
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        lineItemIsEstimated: true,
      }
    })
    .cond([states.EXACT_FEE_CALCULATED, CUSTOMER], () => {
      const primary = isCustomerBanned ? null : actionButtonProps(transitions.REQUEST_PAYMENT, CUSTOMER);
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        showActionButtons: true,
        primaryButtonProps: primary,
        lineItemIsEstimated: true
      }
    })
    .cond([states.REQUEST_CANCELED, _], () => {
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
      }
    })
    .cond([states.PENDING_PAYMENT, PROVIDER], () => {
      const primary = isCustomerBanned ? null : actionButtonProps(transitions.REPORT, PROVIDER);
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        showActionButtons: true,
        primaryButtonProps: primary,
      }
    })
    .cond([states.OPERATOR_PROCESSING, _], () => {
      return {
        processName,
        processState,
        showLineItemForm: false,
        showPriceBreakdown: true,
        lineItemIsEstimated: true,
      }
    })
    .cond([states.COMPLETED, _], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showReviewAsFirstLink: true,
        showActionButtons: true,
        primaryButtonProps: leaveReviewProps,
        showPriceBreakdown: true,
        lineItemIsEstimated: true,
      };
    })
    .cond([states.PAYMENT_EXPIRED, _], () => {
      return {
        processName,
        processState,
        showPriceBreakdown: true,
        lineItemIsEstimated: true,
      };
    })
    .cond([states.REVIEWED_BY_PROVIDER, CUSTOMER], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showReviewAsSecondLink: true,
        showActionButtons: true,
        primaryButtonProps: leaveReviewProps,
        lineItemIsEstimated: true,
        showPriceBreakdown: true,
      };
    })
    .cond([states.REVIEWED_BY_PROVIDER, PROVIDER], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        lineItemIsEstimated: true,
        showPriceBreakdown: true,
      };
    })
    .cond([states.REVIEWED_BY_CUSTOMER, CUSTOMER], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        lineItemIsEstimated: true,
        showPriceBreakdown: true,
      };
    })
    .cond([states.REVIEWED_BY_CUSTOMER, PROVIDER], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showReviewAsSecondLink: true,
        showActionButtons: true,
        primaryButtonProps: leaveReviewProps,
        lineItemIsEstimated: true,
        showPriceBreakdown: true,
      };
    })
    .cond([states.REVIEWED, _], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showReviews: true,
        showPriceBreakdown: true,
        lineItemIsEstimated: true,
      };
    })
    .default(() => {
      // Default values for other states
      return { processName, processState, showDetailCardHeadings: true };
    })
    .resolve();
};
