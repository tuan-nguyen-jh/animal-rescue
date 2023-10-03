import React from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays'

// Import configs and util modules
import { intlShape, injectIntl } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import * as validators from '../../../../util/validators';

// Import shared components
import { Button, FieldTextInput, FieldPhoneNumberInput } from '../../../../components';

// Import modules from this directory
import css from './EditListingStaffsForm.module.css';
import { FieldArray } from 'react-final-form-arrays';


export const EditListingStaffsFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{
      // potentially other mutators could be merged here
      ...arrayMutators
    }}
    render={formRenderProps => {
      const {
        formId,
        autoFocus,
        className,
        disabled,
        ready,
        handleSubmit,
        marketplaceCurrency,
        unitType,
        listingMinimumPriceSubUnits,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
      } = formRenderProps;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      const required = validators.required('This field is required');
      const emailFormatValid = validators.emailFormatValid('Invalid email address');
      const nonEmptyArray = validators.nonEmptyArray('Required at least one staff');
      const validPhoneNumber = validators.validPhoneNumber("Invalid phone number");
      return (
        <form onSubmit={handleSubmit}>
          <FieldArray name="staffs" validate={nonEmptyArray}>
            {({ fields }) => (
              <div key={`${formId}.index`}>
                {fields.map((name, index) => (

                  <div key={name} className={css.contactForm}>
                    <p className={css.staffIndex}>
                      Staff #{index + 1}
                    </p>
                    <button className={css.closeButton} type="button" onClick={() => {
                      fields.remove(index);
                    }}>
                      X
                    </button>

                    <FieldTextInput
                      className={css.field}
                      type="text"
                      id={`${index}.firstName`}
                      name={`${name}.firstName`}
                      label="First Name"
                      validate={required}
                    />
                    <FieldTextInput
                      className={css.field}
                      type="text"
                      id={`${index}.lastName`}
                      name={`${name}.lastName`}
                      label="Last Name"
                      validate={required}
                    />
                    <FieldTextInput
                      className={css.field}
                      type="text"
                      id={`${index}.email`}
                      name={`${name}.email`}
                      label="Email"
                      validate={validators.composeValidators(required, emailFormatValid)}
                    />
                    <FieldPhoneNumberInput
                      name={`${name}.phoneNumber`}
                      id={`${index}.phoneNumber`}
                      label="Phone number"
                      validate={validators.composeValidators(required, validPhoneNumber)}
                    />
                  </div>

                ))}
                <button
                  className={css.addButton}
                  type="button"
                  onClick={() => {
                    fields.push({ firstName: '', lastName: '', email: '', phoneNumber: '' });
                  }}
                >
                  +
                </button>
              </div>
            )}
          </FieldArray>

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </form>
      );
    }}
  />
);

EditListingStaffsFormComponent.defaultProps = {
  fetchErrors: null,
  formId: 'EditListingStaffsForm',
};

EditListingStaffsFormComponent.propTypes = {
  formId: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  marketplaceCurrency: string.isRequired,
  unitType: string.isRequired,
  listingMinimumPriceSubUnits: number,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingStaffsFormComponent);
