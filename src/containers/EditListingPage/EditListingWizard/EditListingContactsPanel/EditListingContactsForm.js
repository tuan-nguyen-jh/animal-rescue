import React from 'react';
import { bool, func, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays'

// Import configs and util modules
import { intlShape, injectIntl } from '../../../../util/reactIntl';
import { composeValidators, required, emailFormatValid, nonEmptyArray } from '../../../../util/validators';

// Import shared components
import { Button, FieldTextInput, FieldPhoneNumberInput, IconAdd, IconClose } from '../../../../components';

// Import modules from this directory
import css from './EditListingContactsForm.module.css';
import { FieldArray } from 'react-final-form-arrays';


export const EditListingContactsFormComponent = props => (
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

      const requiredContactsForm = required(intl.formatMessage(
        { id: 'EditListingContactsForm.fieldRequired' }
      ));
      const emailFormatValidContactsForm = emailFormatValid(intl.formatMessage(
        { id: 'EditListingContactsForm.emailInvalid' }
      ));
      const nonEmptyArrayContactsForm = nonEmptyArray(intl.formatMessage(
        { id: 'EditListingContactsForm.nonEmptyArray' }
      ));

      return (
        <form onSubmit={handleSubmit}>
          <FieldArray name="contacts" validate={nonEmptyArrayContactsForm}>
            {({ fields }) => (
              <div key={`${formId}.index`}>
                {fields.map((name, index) => (

                  <div key={name} className={css.contactForm}>
                    <div className={css.header}>
                      <p className={css.staffIndex}>
                        {intl.formatMessage({id: "EditListingContactsForm.contactFormLabel"})} #{index + 1}
                      </p>
                      <button className={css.closeButton} type="button" onClick={() => {
                        fields.remove(index);
                      }}>
                        <IconClose/>
                      </button>
                    </div>

                    <FieldTextInput
                      className={css.field}
                      type="text"
                      id={`${name}.email`}
                      name={`${name}.email`}
                      label={intl.formatMessage({ id: "EditListingContactsForm.emailLabel" })}
                      validate={composeValidators(requiredContactsForm, emailFormatValidContactsForm)}
                    />
                    <FieldPhoneNumberInput
                      id={`${name}.phoneNumber`}
                      name={`${name}.phoneNumber`}
                      label={intl.formatMessage({ id: "EditListingContactsForm.phoneNumberLabel" })}
                      validate={requiredContactsForm}
                    />
                  </div>

                ))}
                <button
                  className={css.addButton}
                  type="button"
                  onClick={() => {
                    fields.push({ email: '', phoneNumber: '' });
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

EditListingContactsFormComponent.defaultProps = {
  fetchErrors: null,
  formId: 'EditListingContactsForm',
};

EditListingContactsFormComponent.propTypes = {
  formId: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
};

export default compose(injectIntl)(EditListingContactsFormComponent);
