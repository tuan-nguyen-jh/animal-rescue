/* eslint-disable no-console */
import React from 'react';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { FieldTextInput } from '..';
import { required, numberAtLeast, composeValidators } from '../../util/validators';
import { formatNumber, parse } from '../FieldPhoneNumberInput/fiFormatter';

import { MINIMUN_QUANTITY } from '../../config/configBookingService';

import css from './LineItemFormMaybe.module.css';

const FormComponent = props =>
(<FinalForm
  {...props}
  render={fieldRenderProps => {
    const { handleSubmit,
      formName,
      intl
    } = fieldRenderProps;

    const { quantity,  setNewQuantity } = props;

    const requiredLineItem = required(intl.formatMessage({
      id: 'OrderBreakdown.lineItemFormRequired'
    }));
    const requiredAtLeastOne = numberAtLeast(`${intl.formatMessage({
      id: 'OrderBreakdown.lineItemFormAtLeast'
    })} ${MINIMUN_QUANTITY}`, MINIMUN_QUANTITY);

    const inputProps = {
      type: 'text',
      format: formatNumber,
      parse: parse,
    };

    const handleChange = (formState) => {
      if (formState.values.lineItem) {
        setNewQuantity(formState.values.lineItem)
      }
    }

    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <FormSpy onChange={handleChange} />
        <FieldTextInput
          className={css.field}
          id={`${formName}.lineItem`}
          name="lineItem"
          label={intl.formatMessage({ id: 'OrderBreakdown.lineItemFormLabel' })}
          validate={composeValidators(requiredAtLeastOne, requiredLineItem)}
          defaultValue={`${quantity}`}
          {...inputProps}
        />
      </form>
    );
  }}
/>);

const LineItemFormMaybe = {
  component: compose(injectIntl)(FormComponent),
  props: {
    formName: 'lineItemForm',
    onSubmit: values => {
      console.log('submit values:', values);
    },
  },
  group: 'lineItemForm',
};

export default LineItemFormMaybe;
