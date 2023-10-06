/**
 * Transaction process graph for bookings:
 *   - acc-rescue-booking
 */

export const transitions = {
  REQUEST_BOOKING: 'transition/request-booking',
  CUSTOMER_DECLINE: 'transition/customer-decline',
  PROVIDER_DECLINE: 'transition/provider-decline',
  ACCEPT: 'transition/accept',
  SENT_REQUEST_EXPIRE: 'transition/sent-request-expire',
  PROVIDER_CANCEL: 'transition/provider-cancel',
  CUSTOMER_CANCEL: 'transition/customer-cancel',
  OPERATOR_CANCEL: 'transition/operator-cancel',
  ACCEPTED_REQUEST_EXPIRE: 'transition/accepted-request-expire',
  CONFIRM_REQUEST: 'transition/confirm-request',
  FINISH: 'transition/finish',
  REQUEST_PAYMENT: 'transition/request-payment',
  EXPIRE_PAYMENT: 'transition/expire-payment',
  CONFIRM_PAYMENT: 'transition/confirm-payment',
  COMPLETE: 'transition/complete',
  REVIEW_1_BY_PROVIDER: 'transition/review-1-by-provider',
  REVIEW_2_BY_PROVIDER: 'transition/review-2-by-provider',
  REVIEW_1_BY_CUSTOMER: 'transition/review-1-by-customer',
  REVIEW_2_BY_CUSTOMER: 'transition/review-2-by-customer',
  EXPIRE_CUSTOMER_REVIEW_PERIOD: 'transition/expire-customer-review-period',
  EXPIRE_PROVIDER_REVIEW_PERIOD: 'transition/expire-provider-review-period',
  EXPIRE_REVIEW_PERIOD: 'transition/expire-review-period',
};

export const states = {
  INITIAL: 'initial',
  BOOKING_REQUEST_SENT: 'booking-request-sent',
  REQUEST_DECLINED: 'request-decline',
  REQUEST_ACCEPTED: 'request-accepted',
  REQUEST_CANCELED: 'request-canceled',
  REQUEST_EXPIRED: 'request-expired',
  OFFICER_DISPATCHED: 'officer-dispatched',
  EXACT_FEE_CALCULATED: 'exact-fee-calculated',
  PENDING_PAYMENT: 'pending-payment',
  PAYMENT_EXPIRED: 'pending-expired',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
  REVIEWED: 'reviewed',
  REVIEWED_BY_CUSTOMER: 'reviewed-by-customer',
  REVIEWED_BY_PROVIDER: 'reviewed-by-provider',
};

/**
 * Description of transaction process graph
 *
 * You should keep this in sync with transaction process defined in Marketplace API
 *
 * Note: we don't use yet any state machine library,
 *       but this description format is following Xstate (FSM library)
 *       https://xstate.js.org/docs/
 */
export const graph = {
  // id is defined only to support Xstate format.
  // However if you have multiple transaction processes defined,
  // it is best to keep them in sync with transaction process aliases.
  id: 'acc-rescue-booking/release-1',

  // This 'initial' state is a starting point for new transaction
  initial: states.INITIAL,

  // States
  states: {
    [states.INITIAL]: {
      on: {
        [transitions.REQUEST_BOOKING]: states.BOOKING_REQUEST_SENT,
      },
    },
    [states.BOOKING_REQUEST_SENT]: {
      on: {
        [transitions.SENT_REQUEST_EXPIRE]: states.REQUEST_EXPIRED,
        [transitions.CUSTOMER_DECLINE]: states.REQUEST_DECLINED,
        [transitions.PROVIDER_DECLINE]: states.REQUEST_DECLINED,
        [transitions.ACCEPT]: states.REQUEST_ACCEPTED,
      },
    },
    [states.REQUEST_ACCEPTED]:{
      on:{
        [transitions.PROVIDER_CANCEL]: states.REQUEST_CANCELED,
        [transitions.CUSTOMER_CANCEL]: states.REQUEST_CANCELED,
        [transitions.OPERATOR_CANCEL]: states.REQUEST_CANCELED,
        [transitions.ACCEPTED_REQUEST_EXPIRE]: states.REQUEST_EXPIRED,
        [transitions.CONFIRM_REQUEST]: states.OFFICER_DISPATCHED,
      }
    },

    [states.OFFICER_DISPATCHED]: {
      on: {
        [transitions.FINISH]: states.EXACT_FEE_CALCULATED,
      },
    },

    [states.EXACT_FEE_CALCULATED]: {
      on: {
        [transitions.REQUEST_PAYMENT]: states.PENDING_PAYMENT,
      },
    },

    [states.PENDING_PAYMENT]: {
      on: {
        [transitions.EXPIRE_PAYMENT]: states.PAYMENT_EXPIRED,
        [transitions.CONFIRM_PAYMENT]: states.COMPLETED,
      },
    },

    [states.COMPLETED]: {
      on: {
        [transitions.COMPLETE]: states.DELIVERED,
      },
    },

    [states.PAYMENT_EXPIRED]: {},
    [states.REQUEST_EXPIRED]: {},
    [states.REQUEST_CANCELED]: {},
    [states.REQUEST_DECLINED]: {},

    [states.DELIVERED]: {
      on: {
        [transitions.EXPIRE_REVIEW_PERIOD]: states.REVIEWED,
        [transitions.REVIEW_1_BY_CUSTOMER]: states.REVIEWED_BY_CUSTOMER,
        [transitions.REVIEW_1_BY_PROVIDER]: states.REVIEWED_BY_PROVIDER,
      },
    },

    [states.REVIEWED_BY_CUSTOMER]: {
      on: {
        [transitions.REVIEW_2_BY_PROVIDER]: states.REVIEWED,
        [transitions.EXPIRE_PROVIDER_REVIEW_PERIOD]: states.REVIEWED,
      },
    },
    [states.REVIEWED_BY_PROVIDER]: {
      on: {
        [transitions.REVIEW_2_BY_CUSTOMER]: states.REVIEWED,
        [transitions.EXPIRE_CUSTOMER_REVIEW_PERIOD]: states.REVIEWED,
      },
    },
    [states.REVIEWED]: { type: 'final' },
  },
};

// Check if a transition is the kind that should be rendered
// when showing transition history (e.g. ActivityFeed)
// The first transition and most of the expiration transitions made by system are not relevant
export const isRelevantPastTransition = transition => {
  return [
    transitions.SENT_REQUEST_EXPIRE,
    transitions.CUSTOMER_DECLINE,
    transitions.PROVIDER_DECLINE,
    transitions.ACCEPT,
    transitions.PROVIDER_CANCEL,
    transitions.CUSTOMER_CANCEL,
    transitions.OPERATOR_CANCEL,
    transitions.ACCEPTED_REQUEST_EXPIRE,
    transitions.CONFIRM_REQUEST,
    transitions.FINISH,
    transitions.REQUEST_PAYMENT,
    transitions.EXPIRE_PAYMENT,
    transitions.COMPLETE,
    transitions.CONFIRM_PAYMENT,
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.REVIEW_1_BY_PROVIDER,
    transitions.REVIEW_2_BY_CUSTOMER,
    transitions.REVIEW_2_BY_PROVIDER,
  ].includes(transition);
};

// Processes might be different on how reviews are handled.
// Default processes use two-sided diamond shape, where either party can make the review first
export const isCustomerReview = transition => {
  return [transitions.REVIEW_1_BY_CUSTOMER, transitions.REVIEW_2_BY_CUSTOMER].includes(transition);
};

// Processes might be different on how reviews are handled.
// Default processes use two-sided diamond shape, where either party can make the review first
export const isProviderReview = transition => {
  return [transitions.REVIEW_1_BY_PROVIDER, transitions.REVIEW_2_BY_PROVIDER].includes(transition);
};

// Check if the given transition is privileged.
//
// Privileged transitions need to be handled from a secure context,
// i.e. the backend. This helper is used to check if the transition
// should go through the local API endpoints, or if using JS SDK is
// enough.
export const isPrivileged = transition => {
  return [transitions.REQUEST_PAYMENT, transitions.FINISH, transitions.ACCEPT].includes(
    transition
  );
};

// Check when transaction is completed (booking over)
export const isCompleted = transition => {
  const txCompletedTransitions = [
    transitions.COMPLETE,
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.REVIEW_1_BY_PROVIDER,
    transitions.REVIEW_2_BY_CUSTOMER,
    transitions.REVIEW_2_BY_PROVIDER,
    transitions.EXPIRE_REVIEW_PERIOD,
    transitions.EXPIRE_CUSTOMER_REVIEW_PERIOD,
    transitions.EXPIRE_PROVIDER_REVIEW_PERIOD,
  ];
  return txCompletedTransitions.includes(transition);
};

// Check when transaction is refunded (booking did not happen)
// In these transitions action/stripe-refund-payment is called
export const isRefunded = transition => {
  const txRefundedTransitions = [];
  return txRefundedTransitions.includes(transition);
};

export const statesNeedingProviderAttention = [states.BOOKING_REQUEST_SENT, states.OFFICER_DISPATCHED];
