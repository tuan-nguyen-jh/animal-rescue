import React from 'react';
import { constructQueryParamName } from './SearchPage.shared';
import SelectSingleFilter from './SelectSingleFilter/SelectSingleFilter';
import { listingTypeFilter } from '../../config/configSearch';

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
  const { liveEdit, showAsPopup } = rest;
  const { key, scope, enumOptions } = listingTypeFilter;
  const useHistoryPush = liveEdit || showAsPopup;
  const prefix = idPrefix || 'SearchPage';
  const componentId = `${prefix}.${key.toLowerCase()}`;
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
