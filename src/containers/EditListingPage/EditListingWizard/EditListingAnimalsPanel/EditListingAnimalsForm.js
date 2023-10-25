import React, { useState } from 'react';
import { compose } from 'redux';
import { bool, func, object, string } from 'prop-types';

// Import configs and util modules
import { intlShape, injectIntl } from '../../../../util/reactIntl';

// Import shared components
import CSVReader from './CSVReader';
import { Button } from '../../../../components';

// Import modules from this directory
import css from './EditListingAnimalsForm.module.css';

const formatAnimalListing = (rows, headers) => {
  return rows.map(row => {
    return row.reduce((dict, item, index) => {
      const splitData = Array.isArray(item)? item : item.split(';');
      if (splitData.length > 1) {
        dict[headers[index].trim()] = splitData.map((path) => path.trim());
      } else {
        dict[headers[index].trim()] = item.trim();
      }
      return dict
    }, {})
  })
}

const convertInitialValues = (initialValues) => {
  const data = []
  data.push(Object.keys(initialValues.animals[0]));
  initialValues.animals.map((item) => {
    data.push(Object.values(item))
  })
  return data
}

export const EditListingAnimalsFormComponent = props => {
  const {
    onSubmit,
    submitInProgress,
    saveActionMsg,
    submitReady,
    disabled,
    initialValues
  } = props;

  const [data, setData] = useState(initialValues?.animals?.length > 0 ? convertInitialValues(initialValues) : []);

  const headers = data[0];
  const rows = formatAnimalListing(data.slice(1), headers);

  const handleClick = () => {
    onSubmit({
      publicData: {
        animals: rows,
      }
    });
  }

  return <>
    <CSVReader rows={rows} setData={setData} />
    <Button
      className={css.submitButton}
      type="submit"
      inProgress={submitInProgress}
      ready={submitReady}
      onClick={handleClick}
      disabled={disabled}
    >
      {saveActionMsg}
    </Button>
  </>
};
EditListingAnimalsFormComponent.defaultProps = {
  formId: 'EditListingAnimalsForm',
};

EditListingAnimalsFormComponent.propTypes = {
  formId: string,
  onSubmit: func.isRequired,
  submitInProgress: bool,
  disabled: bool,
  initialValues: object,
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(EditListingAnimalsFormComponent);