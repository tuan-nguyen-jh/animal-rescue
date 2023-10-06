import React from 'react';
import { bool, func, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays'

// Import configs and util modules
import { intlShape, injectIntl } from '../../../../util/reactIntl';
import { required, emailFormatValid, nonEmptyArray, composeValidators } from '../../../../util/validators';

// Import shared components
import { Button, FieldPhoneNumberInput, FieldTextInput, IconAdd, IconClose } from '../../../../components';

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
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
      } = formRenderProps;

      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress || pristine;

      const requiredStaffsForm = required(intl.formatMessage(
        { id: 'EditListingStaffsForm.fieldRequired' }
      ));
      const emailFormatValidStaffsForm = emailFormatValid(intl.formatMessage(
        { id: 'EditListingStaffsForm.emailInvalid' }
      ));
      const nonEmptyArrayStaffsForm = nonEmptyArray(intl.formatMessage(
        { id: 'EditListingStaffsForm.nonEmptyArray' }
      ));
      return (
        <form onSubmit={handleSubmit}>
          <FieldArray name="staffs" validate={nonEmptyArrayStaffsForm}>
            {({ fields }) => (
              <div key={`${formId}.index`}>
                {fields.map((name, index) => (

                  <div key={name} className={css.contactForm}>
                    <div className={css.header}>
                      <p className={css.staffIndex}>
                        {intl.formatMessage({ id: "EditListingStaffsForm.staffFormLabel" })} #{index + 1}
                      </p>
                      <button className={css.closeButton} type="button" onClick={() => {
                        fields.remove(index);
                      }}>
                        <IconClose />
                      </button>
                    </div>
                    <FieldTextInput
                      className={css.field}
                      type="text"
                      id={`${name}.firstName`}
                      name={`${name}.firstName`}
                      label={intl.formatMessage({ id: 'EditListingStaffsForm.firstNameLabel' })}
                      validate={requiredStaffsForm}
                    />
                    <FieldTextInput
                      className={css.field}
                      type="text"
                      id={`${name}.lastName`}
                      name={`${name}.lastName`}
                      label={intl.formatMessage({ id: 'EditListingStaffsForm.lastNameLabel' })}
                      validate={requiredStaffsForm}
                    />
                    <FieldTextInput
                      className={css.field}
                      type="text"
                      id={`${name}.email`}
                      name={`${name}.email`}
                      label={intl.formatMessage({ id: 'EditListingStaffsForm.emailLabel' })}
                      validate={composeValidators(requiredStaffsForm, emailFormatValidStaffsForm)}
                    />
                    <FieldPhoneNumberInput
                      id={`${name}.phoneNumber`}
                      name={`${name}.phoneNumber`}
                      label={intl.formatMessage({ id: 'EditListingStaffsForm.phoneNumberLabel' })}
                      validate={requiredStaffsForm}
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
                  <IconAdd/>
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
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
};

export default compose(injectIntl)(EditListingStaffsFormComponent);
