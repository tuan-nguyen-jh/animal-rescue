/////////////////////////////////////////////////////////
// Configurations related to listing.                  //
// Main configuration here is the extended data config //
/////////////////////////////////////////////////////////

// NOTE: if you want to change the structure of the data,
// you should also check src/util/configHelpers.js
// some validation is added there.

/**
 * Configuration options for listing fields (custom extended data fields):
 * - key:                           Unique key for the extended data field.
 * - scope (optional):              Scope of the extended data can be either 'public' or 'private'.
 *                                  Default value: 'public'.
 *                                  Note: listing doesn't support 'protected' scope atm.
 * - includeForListingTypes:        An array of listing types, for which the extended
 *   (optional)                     data is relevant and should be added.
 * - schemaType (optional):         Schema for this extended data field.
 *                                  This is relevant when rendering components and querying listings.
 *                                  Possible values: 'enum', 'multi-enum', 'text', 'long', 'boolean'.
 * - enumOptions (optional):        Options shown for 'enum' and 'multi-enum' extended data.
 *                                  These are used to render options for inputs and filters on
 *                                  EditListingPage, ListingPage, and SearchPage.
 * - filterConfig:                  Filter configuration for listings query.
 *    - indexForSearch (optional):    If set as true, it is assumed that the extended data key has
 *                                    search index in place. I.e. the key can be used to filter
 *                                    listing queries (then scope needs to be 'public').
 *                                    Note: Flex CLI can be used to set search index for the key:
 *                                    https://www.sharetribe.com/docs/references/extended-data/#search-schema
 *                                    Read more about filtering listings with public data keys from API Reference:
 *                                    https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
 *                                    Default value: false,
 *   - filterType:                    Sometimes a single schemaType can be rendered with different filter components.
 *                                    For 'enum' schema, filterType can be 'SelectSingleFilter' or 'SelectMultipleFilter'
 *   - label:                         Label for the filter, if the field can be used as query filter
 *   - searchMode (optional):         Search mode for indexed data with multi-enum schema.
 *                                    Possible values: 'has_all' or 'has_any'.
 *   - group:                         SearchPageWithMap has grouped filters. Possible values: 'primary' or 'secondary'.
 * - showConfig:                    Configuration for rendering listing. (How the field should be shown.)
 *   - label:                         Label for the saved data.
 *   - isDetail                       Can be used to hide detail row (of type enum, boolean, or long) from listing page.
 *                                    Default value: true,
 * - saveConfig:                    Configuration for adding and modifying extended data fields.
 *   - label:                         Label for the input field.
 *   - placeholderMessage (optional): Default message for user input.
 *   - isRequired (optional):         Is the field required for providers to fill
 *   - requiredMessage (optional):    Message for those fields, which are mandatory.
 */
export const ANIMAL_LISTING_TYPE = 'animal';
export const ACC_LISTING_TYPE = 'acc';
export const ACC_SERVICES = {
  adoption: 'adoption',
  rescue: 'rescue'
}

export const ADOPTED = {
  adopted: 'yes',
  notAdopted: 'no'
}

export const listingFields = [
  {
    key: 'service',
    scope: 'public',
    includedForListingTypes: [ACC_LISTING_TYPE],
    schemaType: 'multi-enum',
    enumOptions: [
      { option: 'adoption', label: 'Adoption' },
      { option: 'rescue', label: 'Rescue' },
    ],
    filterConfig: {
      indexForSearch: true,
      label: 'Service',
      group: 'secondary',
    },
    showConfig: {
      label: 'Service',
      isDetail: true,
    },
    saveConfig: {
      label: 'Service',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select at least an option',
    },
  },
  {
    key: 'typeOfAnimal',
    scope: 'public',
    includeForListingTypes: [ANIMAL_LISTING_TYPE],
    schemaType: 'enum',
    enumOptions: [
      { option: 'dog', label: 'Dog' },
      { option: 'cat', label: 'Cat' },
      { option: 'others', label: 'Others' },
    ],
    filterConfig: {
      indexForSearch: true,
      filterType: 'SelectSingleFilter',
      label: 'Type of animal',
      group: 'primary',
    },
    showConfig: {
      label: 'Type of animal',
      isDetail: true,
    },
    saveConfig: {
      label: 'Type of animal',
      placeholderMessage: 'Select type of animal',
      isRequired: true,
      requiredMessage: 'You need to select at least an option',
    },
  },
  {
    key: 'birth',
    includeForListingTypes: [ANIMAL_LISTING_TYPE],
    scope: 'public',
    schemaType: 'text',
    showConfig: {
      label: 'Date of birth',
    },
    saveConfig: {
      label: 'Date of birth',
      placeholderMessage: 'dd/mm/year',
      isRequired: false,
    },
  },
  {
    key: 'size',
    includeForListingTypes: [ANIMAL_LISTING_TYPE],
    scope: 'public',
    schemaType: 'enum',
    enumOptions: [
      { option: 's', label: 'S' },
      { option: 'm', label: 'M' },
      { option: 'l', label: 'L' },
    ],
    filterConfig: {
      indexForSearch: true,
      filterType: 'SelectSingleFilter',
      label: 'Size of animal',
      group: 'primary',
    },
    showConfig: {
      label: 'Size of animal',
      isDetail: true,
    },
    saveConfig: {
      label: 'Size of animal',
      placeholderMessage: 'Size of animal',
      isRequired: true,
      requiredMessage: 'You need to select at least an option',
    },
  },
  {
    key: 'isAdopted',
    includeForListingTypes: [ANIMAL_LISTING_TYPE],
    scope: 'public',
    schemaType: 'enum',
    enumOptions: [
      { option: 'no', label: 'No' },
      { option: 'yes', label: 'Yes' },
    ],
    saveConfig: {
      label: 'Is adopted',
      placeholderMessage: 'Is adopted',
      isRequired: true,
      requiredMessage: 'You need to select an option'
    },
  },
  {
    key: 'hostName',
    includeForListingTypes: [ANIMAL_LISTING_TYPE],

    scope: 'public',
    schemaType: 'text',
    saveConfig: {
      label: 'Host name',
      placeholderMessage: 'Host name',
      isRequired: false,
    },
  },
  {
    key: 'hostPhone',
    includeForListingTypes: [ANIMAL_LISTING_TYPE],
    scope: 'public',
    schemaType: 'text',
    saveConfig: {
      label: 'Host phonenumber',
      placeholderMessage: 'Host phonenumber',
      isRequired: false,
    },
  },
  {
    key: 'dateOfAdoption',
    includeForListingTypes: [ANIMAL_LISTING_TYPE],
    scope: 'public',
    schemaType: 'text',
    saveConfig: {
      label: 'Date of adoption',
      placeholderMessage: 'dd/mm/year',
      isRequired: false,
    },
  },
];

///////////////////////////////////////////////////////////////////////
// Configurations related to listing types and transaction processes //
///////////////////////////////////////////////////////////////////////

// A presets of supported listing configurations
//
// Note 1: With first iteration of hosted configs, we are unlikely to support
//         multiple listing types, even though this template has some
//         rudimentary support for it.
// Note 2: transaction type is part of listing type. It defines what transaction process and units
//         are used when transaction is created against a specific listing.

/**
 * Configuration options for listing experience:
 * - listingType:         Unique string. This will be saved to listing's public data on
 *                        EditListingWizard.
 * - label                Label for the listing type. Used as microcopy for options to select
 *                        listing type in EditListingWizard.
 * - transactionType      Set of configurations how this listing type will behave when transaction is
 *                        created.
 *   - process              Transaction process.
 *                          The process must match one of the processes that this client app can handle
 *                          (check src/util/transactions/transaction.js) and the process must also exists in correct
 *                          marketplace environment.
 *   - alias                Valid alias for the aforementioned process. This will be saved to listing's
 *                          public data as transctionProcessAlias and transaction is initiated with this.
 *   - unitType             Unit type is mainly used as pricing unit. This will be saved to
 *                          transaction's protected data.
 *                          Recommendation: don't use same unit types in completely different processes
 *                          ('item' sold should not be priced the same as 'item' booked).
 * - stockType            This is relevant only to listings using default-purchase process.
 *                        If set to 'oneItem', stock management is not showed and the listing is
 *                        considered unique (stock = 1).
 *                        Possible values: 'oneItem' and 'multipleItems'.
 *                        Default: 'multipleItems'.
 * - defaultListingFields This is relevant only to listings using default-inquiry process atm.
 *                        It contains price: true/false value to indicate, whether price should be shown.
 *                        If defaultListingFields.price is not explicitly set to _false_, price will be shown.
 */

export const txTypes = {
  adoption: {
    process: 'adoption-booking',
    alias: 'adoption-booking/release-1',
    unitType: 'hour',
  },
  rescue: {
    process: 'acc-rescue-booking',
    alias: 'acc-rescue-booking/release-1',
    unitType: 'hour',
  },
  inquiry: {
    process: 'default-inquiry',
    alias: 'default-inquiry/release-1',
    unitType: 'inqury'
  }
};

export const listingTypes = [
  {
    listingType: 'acc',
    label: 'Animal Control Center',
    transactionType: {
      process: 'acc-rescue-booking',
      alias: 'acc-rescue-booking/release-1',
      unitType: 'hour',
    },
  },
  // // Here are some examples for other listingTypes
  // // TODO: SearchPage does not work well if both booking and product selling are used at the same time
  // {
  //   listingType: 'nightly-booking',
  //   label: 'Nightly booking',
  //   transactionType: {
  //     process: 'default-booking',
  //     alias: 'default-booking/release-1',
  //     unitType: 'night',
  //   },
  // },
  // {
  //   listingType: 'hourly-booking',
  //   label: 'Hourly booking',
  //   transactionType: {
  //     process: 'default-booking',
  //     alias: 'default-booking/release-1',
  //     unitType: 'hour',
  //   },
  // },
  // {
  //   listingType: 'product-selling',
  //   label: 'Sell bicycles',
  //   transactionType: {
  //     process: 'default-purchase',
  //     alias: 'default-purchase/release-1',
  //     unitType: 'item',
  //   },
  //   stockType: 'multipleItems',
  // },
  // {
  //   listingType: 'inquiry',
  //   label: 'Inquiry',
  //   transactionType: {
  //     process: 'default-inquiry',
  //     alias: 'default-inquiry/release-1',
  //     unitType: 'inquiry',
  //   },
  //   defaultListingFields: {
  //     price: false,
  //   },
  // },
];

// SearchPage can enforce listing query to only those listings with valid listingType
// However, it only works if you have set 'enum' type search schema for the public data fields
//   - listingType
//
//  Similar setup could be expanded to 2 other extended data fields:
//   - transactionProcessAlias
//   - unitType
//
// Read More:
// https://www.sharetribe.com/docs/how-to/manage-search-schemas-with-flex-cli/#adding-listing-search-schemas
export const enforceValidListingType = false;
