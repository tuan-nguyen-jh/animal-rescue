import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';

// Import shared components
import { H3, ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingContactsForm from './EditListingContactsForm';
import css from './EditListingContactsPanel.module.css';

const getInitialValues = params => {
  const { contacts } = params?.listing?.attributes?.publicData || {};
  return { contacts };
};

const EditListingContactsPanel = props => {
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
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const initialValues = getInitialValues(props);
  const isPublished = listing?.attributes?.state !== LISTING_STATE_DRAFT;

  return (
    <div className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingContactsPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingContactsPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>
      <EditListingContactsForm
          initialValues={initialValues}
          onSubmit={values => {
            const { contacts } = values;
            // New values for listing attributes
            const updateValues = {
              publicData: {
                contacts,
              },
            };
            onSubmit(updateValues);
          }}
          saveActionMsg={submitButtonText}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
        />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingContactsPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingContactsPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
};

export default EditListingContactsPanel;
