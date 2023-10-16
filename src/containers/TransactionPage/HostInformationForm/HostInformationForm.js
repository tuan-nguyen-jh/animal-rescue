import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { isTransactionsTransitionAlreadyReviewed } from '../../../util/errors';
import { propTypes } from '../../../util/types';
import { required } from '../../../util/validators';

import { Form, PrimaryButton, FieldTextInput, FieldSelect } from '../../../components';

import css from './HostInformationForm.module.css';

const HostInformationFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        className,
        rootClassName,
        disabled,
        handleSubmit,
        intl,
        formId,
        invalid,
        hostInfoSent,
        sendHostInfoError,
        sendHostInfoInProgress,
      } = fieldRenderProps;
      const { listingAnimals } = props;

      const hostNameContent = intl.formatMessage({
        id: 'HostInformationForm.hostNameContentLabel',
      });
      const hostNameContentPlaceholderMessage = intl.formatMessage({
        id: 'HostInformationForm.hostNameContentPlaceholder',
      });

      const hostPhoneContent = intl.formatMessage({
        id: 'HostInformationForm.hostPhoneContentLabel',
      });
      const hostPhoneContentPlaceholderMessage = intl.formatMessage({
        id: 'HostInformationForm.hostPhoneContentPlaceholder',
      });

      const dateContent = intl.formatMessage({ id: 'HostInformationForm.dateContentLabel' });
      const dateContentPlaceholderMessage = intl.formatMessage({
        id: 'HostInformationForm.dateContentPlaceholder',
      });

      const errorMessage = isTransactionsTransitionAlreadyReviewed(sendHostInfoError) ? (
        <p className={css.error}>
          <FormattedMessage id="HostInformationForm.reviewSubmitAlreadySent" />
        </p>
      ) : (
        <p className={css.error}>
          <FormattedMessage id="HostInformationForm.reviewSubmitFailed" />
        </p>
      );
      const errorArea = sendHostInfoError ? errorMessage : <p className={css.errorPlaceholder} />;

      const reviewSubmitMessage = intl.formatMessage({
        id: 'HostInformationForm.hostInfoSubmit',
      });

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = sendHostInfoInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <FieldSelect
            id={'animal'}
            name="animal"
            className={css.hostInfoContent}
            label={intl.formatMessage({ id: 'HostInformationForm.animalLabel' })}
            validate={required(intl.formatMessage({ id: 'HostInformationForm.animalRequired' }))}
          >
            <option disabled value="">
              {intl.formatMessage({ id: 'HostInformationForm.animalPlaceholder' })}
            </option>
            {listingAnimals.map(animal => {
              return animal ? (
                <option key={animal.id.uuid} value={animal.id.uuid}>
                  {animal.attributes.title}
                </option>
              ) : null;
            })}
          </FieldSelect>

          <FieldTextInput
            className={css.hostInfoContent}
            type="text"
            id={formId ? `${formId}.hostNameContent` : 'hostNameContent'}
            name="hostName"
            label={hostNameContent}
            placeholder={hostNameContentPlaceholderMessage}
          />
          <FieldTextInput
            className={css.hostInfoContent}
            type="text"
            id={formId ? `${formId}.hostPhoneContent` : 'hostPhoneContent'}
            name="hostPhone"
            label={hostPhoneContent}
            placeholder={hostPhoneContentPlaceholderMessage}
          />
          <FieldTextInput
            className={css.hostInfoContent}
            type="text"
            id={formId ? `${formId}.dateContent` : 'dateContent'}
            name="date"
            label={dateContent}
            placeholder={dateContentPlaceholderMessage}
          />

          {errorArea}
          <PrimaryButton
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={hostInfoSent}
          >
            {reviewSubmitMessage}
          </PrimaryButton>
        </Form>
      );
    }}
  />
);

HostInformationFormComponent.defaultProps = {
  className: null,
  rootClassName: null,
  sendHostInfoError: null,
};

const { bool, func, string } = PropTypes;

HostInformationFormComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  hostInfoSent: bool.isRequired,
  sendHostInfoError: propTypes.error,
  sendHostInfoInProgress: bool.isRequired,
};

const HostInformationForm = compose(injectIntl)(HostInformationFormComponent);
HostInformationForm.displayName = 'HostInformationForm';

export default HostInformationForm;
