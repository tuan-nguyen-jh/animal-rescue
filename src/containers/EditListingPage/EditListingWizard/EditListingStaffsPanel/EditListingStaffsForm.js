import React from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays'

// Import configs and util modules
import appSettings from '../../../../config/settings';
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import * as validators from '../../../../util/validators';
import { types as sdkTypes } from '../../../../util/sdkLoader';

// Import shared components
import { Button, Form, FieldCurrencyInput, FieldTextInput, FieldPhoneNumberInput } from '../../../../components';

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
      const mustBeEmail = value => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
          return undefined
        } else {
          return 'Must be an email address'
        };
      }
      const mustBeAPhoneNumber = value => {
        const phoneRegex = /^[0-9\s()+-]*$/;
        if (phoneRegex.test(value)) {
          return undefined
        } else {
          return "Must be a phone number"
        }
      }
      const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

      return (
        <>
          <form onSubmit={handleSubmit}>
            <FieldArray name="contacts">
              {({ fields }) => (
                <div>
                  {fields.map((name, index) => (
                    <div key={name} className={css.contactForm}>
                      <button className={css.closeButton} type="button" onClick={() => fields.remove(index)}>
                        X
                      </button>

                      <FieldTextInput
                        className={css.field}
                        type="text"
                        id={`${name}.firstName`}
                        name="firstName"
                        label="First Name"
                        validate={required}
                      />
                      <FieldTextInput
                        className={css.field}
                        type="text"
                        id={`${name}.lastName`}
                        name="lastName"
                        label="Last Name"
                        validate={required}
                      />
                      <FieldTextInput
                        className={css.field}
                        type="text"
                        id={`${name}.email`}
                        name="email"
                        label="Email"
                        validate={composeValidators(required, mustBeEmail)}
                      />
                      <FieldPhoneNumberInput
                        id={`${formId}.phoneNumber`}
                        name="phoneNumber"
                        label="Phone number"
                        validate={composeValidators(required, mustBeAPhoneNumber)}
                      />


                    </div>
                  ))}
                  <button
                    className={css.addButton}
                    type="button"
                    onClick={() => fields.push({ firstName: '', lastName: '' })}
                  >
                    +
                  </button>
                </div>
              )}
            </FieldArray>
          </form>

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </>
      );
    }}
  />
);

EditListingStaffsFormComponent.defaultProps = {
  fetchErrors: null,
  listingMinimumPriceSubUnits: 0,
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
