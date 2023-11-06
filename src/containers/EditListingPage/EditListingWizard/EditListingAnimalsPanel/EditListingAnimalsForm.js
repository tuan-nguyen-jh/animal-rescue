import React, { useState } from 'react';
import { compose } from 'redux';
import { bool, func, object, string } from 'prop-types';

// Import configs and util modules
import { intlShape, injectIntl } from '../../../../util/reactIntl';

// Import shared components
import CSVReader from './CSVReader';
import { Button } from '../../../../components';

import { ANIMAL_TABLE_COLUMN_FORMAT } from '../../../../config/configBookingService';

// Import modules from this directory
import css from './EditListingAnimalsForm.module.css';

const convertData = (dataTable) => {
  return dataTable.map((data) => {
    const row = Object.values(data).map(item => item.value);
    return row.reduce((rowDict, item, columnIndex) => {
      const columnFormat = ANIMAL_TABLE_COLUMN_FORMAT.find(
        (format) => format.index === columnIndex
      );
      rowDict[columnFormat.key] = item;
      return rowDict;
    }, {})
  })
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

  const [spread, setSpread] = useState(null);
  const [data, setData] = useState(initialValues?.animals || []);

  const handleClick = () => {
    onSubmit({
      publicData: {
        animals: convertData(
          Object.values(spread.getActiveSheet().toJSON().data.dataTable).slice(1)
        ),
      }
    });
  }

  return <>
    <CSVReader
      data={data}
      setData={setData}
      spread={spread}
      setSpread={setSpread}
    />
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
