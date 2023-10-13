/**
 * Transaction process graph for bookings:
 *   - default-booking
 */

/**
 * Transitions
 *
 * These strings must sync with values defined in Marketplace API,
 * since transaction objects given by API contain info about last transitions.
 * All the actions in API side happen in transitions,
 * so we need to understand what those strings mean.
 */

export const transitions = {
  // When a customer makes a booking to a listing, a transaction is
  // created with the initial request-payment transition.
  // At this transition a PaymentIntent is created by Marketplace API.
  // After this transition, the actual payment must be made on client-side directly to Stripe.
  REQUEST: 'transition/request',

  // A customer can also initiate a transaction with an inquiry, and
  // then transition that with a request.
  INQUIRE: 'transition/inquire',
  REQUEST_AFTER_INQUIRY: 'transition/request-after-inquiry',

  // When the provider accepts or declines a transaction from the
  // SalePage, it is transitioned with the accept or decline transition.
  ACCEPT: 'transition/accept',
  DECLINE: 'transition/decline',

  // The backend automatically expire the transaction.
  EXPIRE: 'transition/expire',

  // Admin can also cancel the transition.
  PROVIDER_CANCEL: 'transition/provider-cancel',
  CUSTOMER_CANCEL: 'transition/customer-cancel',
  OPERATOR_CANCEL: 'transition/operator-cancel',

  // The backend will mark the transaction completed.
  COMPLETE: 'transition/complete',

  PROVIDER_NOT_ADOPT: 'transition/provider-not-adopt',
  CUSTOMER_NOT_ADOPT: 'transition/customer-not-adopt',

  COMPLETE_NOT_ADOPT: 'transition/complete-not-adopt',

  ADOPT: 'transition/adopt',
  COMPLETE_ADOPT: 'transition/complete-adopt',

  // Reviews are given through transaction transitions. Review 1 can be
  // by provider or customer, and review 2 will be the other party of
  // the transaction.
  REVIEW_1_BY_PROVIDER: 'transition/review-1-by-provider',
  REVIEW_2_BY_PROVIDER: 'transition/review-2-by-provider',
  REVIEW_1_BY_CUSTOMER: 'transition/review-1-by-customer',
  REVIEW_2_BY_CUSTOMER: 'transition/review-2-by-customer',
  EXPIRE_CUSTOMER_REVIEW_PERIOD: 'transition/expire-customer-review-period',
  EXPIRE_PROVIDER_REVIEW_PERIOD: 'transition/expire-provider-review-period',
  EXPIRE_REVIEW_PERIOD: 'transition/expire-review-period',
};

/**
 * States
 *
 * These constants are only for making it clear how transitions work together.
 * You should not use these constants outside of this file.
 *
 * Note: these states are not in sync with states used transaction process definitions
 *       in Marketplace API. Only last transitions are passed along transaction object.
 */
export const states = {
  INITIAL: 'initial',
  INQUIRY: 'inquiry',
  BOOKING_REQUEST_SENT: 'booking-request-sent',
  REQUEST_DECLINED: 'request-declined',
  REQUEST_ACCEPTED: 'request-accepted',
  CANCELLED: 'cancelled',
  TOUR_COMPLETED: 'tour-completed',
  NOT_ALLOW_ADOPT: 'not-allow-adopt',
  ALLOW_ADOPT: 'allow-adopt',
  COMPLETED: 'completed',
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
  id: 'default-booking/release-1',

  // This 'initial' state is a starting point for new transaction
  initial: states.INITIAL,

  // States
  states: {
    [states.INITIAL]: {
      on: {
        [transitions.INQUIRE]: states.INQUIRY,
        [transitions.REQUEST]: states.BOOKING_REQUEST_SENT,
      },
    },
    [states.INQUIRY]: {
      on: {
        [transitions.REQUEST_AFTER_INQUIRY]: states.BOOKING_REQUEST_SENT,
      },
    },

    [states.BOOKING_REQUEST_SENT]: {
      on: {
        [transitions.EXPIRE]: states.REQUEST_DECLINED,
        [transitions.DECLINE]: states.REQUEST_DECLINED,
        [transitions.ACCEPT]: states.REQUEST_ACCEPTED
      },
    },

    [states.REQUEST_DECLINED]: {},
    [states.REQUEST_ACCEPTED]: {
      on: {
        [transitions.PROVIDER_CANCEL]: states.CANCELLED,
        [transitions.CUSTOMER_CANCEL]: states.CANCELLED,
        [transitions.OPERATOR_CANCEL]: states.CANCELLED,
        [transitions.COMPLETE]: states.TOUR_COMPLETED,
      },
    },

    [states.CANCELLED]: {},

    [states.TOUR_COMPLETED]: {
      on: {
        [transitions.PROVIDER_NOT_ADOPT]: states.NOT_ALLOW_ADOPT,
        [transitions.CUSTOMER_NOT_ADOPT]: states.NOT_ALLOW_ADOPT,
        [transitions.ADOPT]: states.ALLOW_ADOPT,
      },
    },

    [states.NOT_ALLOW_ADOPT]: {
      on: {
        [transitions.COMPLETE_NOT_ADOPT]: states.COMPLETED
      }
    },

    [states.ALLOW_ADOPT]: {
      on: {
        [transitions.COMPLETE_ADOPT]: states.COMPLETED
      }
    },

    [states.COMPLETED]: {
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
    transitions.ACCEPT,
    transitions.PROVIDER_CANCEL,
    transitions.CUSTOMER_CANCEL,
    transitions.OPERATOR_CANCEL,
    transitions.COMPLETE,
    transitions.DECLINE,
    transitions.EXPIRE,
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
  return [transitions.REQUEST, transitions.REQUEST_AFTER_INQUIRY].includes(
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
  const txRefundedTransitions = [
    transitions.EXPIRE,
    transitions.PROVIDER_CANCEL,
    transitions.CUSTOMER_CANCEL,
    transitions.OPERATOR_CANCEL,
    transitions.DECLINE,
  ];
  return txRefundedTransitions.includes(transition);
};

export const statesNeedingProviderAttention = [states.PREAUTHORIZED];
