import React, { useState } from 'react';
import { compose } from 'redux';
import { string } from 'prop-types';

import classNames from 'classnames';

// Import configs and util modules
import appSettings from '../../../../config/settings';
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';

// Import shared components
import CSVReader from './CSVReader';
import { Button, Form, FieldCurrencyInput, FieldTextInput } from '../../../../components';

// Import modules from this directory
import css from './EditListingAnimalsForm.module.css';

const formatAnimalListing = (rows, headers) => {
  return rows.map(row => {
    return row.reduce((dict, item, index) => {
      dict[headers[index].trim()] = item;
      return dict
    }, {})
  })
}

const convertInitialValues = (initialValues) => {
  const data = []
  data.push(Object.keys(initialValues.animals[0]));
  initialValues.animals.slice(1).map((item)=>{
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
    ready,
    updated,
    initialValues
  } = props;

  const [data, setData] = useState(initialValues? convertInitialValues(initialValues): []);

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
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(EditListingAnimalsFormComponent);
