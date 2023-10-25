import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';

// Import shared components
import { H3, ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingAnimalsForm from './EditListingAnimalsForm';
import css from './EditListingAnimalsPanel.module.css';

const getInitialValues = params => {
  const { animals } = params?.listing?.attributes?.publicData || {};
  return { animals };
};

const EditListingAnimalsPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    submitInProgress,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const isPublished = listing?.id && listing?.attributes?.state !== LISTING_STATE_DRAFT;
  const initialValues = getInitialValues(props);

  return (
    <div className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingAnimalsPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingAnimalsPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>

      <EditListingAnimalsForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        submitInProgress={submitInProgress}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingAnimalsPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAnimalsPanel.propTypes = {
  className: string,
  rootClassName: string,
  listing: object,
  disabled: bool,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  submitInProgress: bool,
};

export default EditListingAnimalsPanel;