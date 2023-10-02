/* eslint-disable no-console */
import EditListingStaffsForm from './EditListingStaffsForm';

export const Empty = {
  component: EditListingStaffsForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditListingPricingForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save price',
    marketplaceCurrency: 'USD',
    unitType: 'day',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
  },
  group: 'page:EditListingPage',
};
