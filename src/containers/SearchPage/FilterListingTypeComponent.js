import React from 'react';
import { constructQueryParamName } from './SearchPage.shared';
import SelectSingleFilter from './SelectSingleFilter/SelectSingleFilter';

// Helper: get enumOptions in a format that works as query parameter
const createFilterOptions = options => options.map(o => ({ key: `${o.option}`, label: o.label }));

/**
 * FilterComponent is used to map configured filter types
 * to actual filter components
 */
const FilterListingTypeComponent = props => {
  const {
    idPrefix,
    urlQueryParams,
    initialValues,
    getHandleChangedValueFn,
    marketplaceCurrency,
    intl,
    ...rest
  } = props;
  const key = 'listingType';
  const { liveEdit, showAsPopup } = rest;
  const useHistoryPush = liveEdit || showAsPopup;
  const prefix = idPrefix || 'SearchPage';
  const componentId = `${prefix}.${key.toLowerCase()}`;
  const scope = 'public'
  const enumOptions = [
    { option: 'acc', label: 'ACC'},
    { option: 'animal', label: 'Animal'},
  ]
  const queryParamNames = [constructQueryParamName(key, scope)];
  return (
    <SelectSingleFilter
      id={componentId}
      label={intl.formatMessage({ id: "FilterListingTypeComponent.label" })}
      queryParamNames={queryParamNames}
      initialValues={initialValues(queryParamNames, liveEdit)}
      onSelect={getHandleChangedValueFn(useHistoryPush)}
      options={createFilterOptions(enumOptions)}
      {...rest}
    />
  )
};

export default FilterListingTypeComponent;
