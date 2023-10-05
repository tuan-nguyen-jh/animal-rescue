import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';

// Import shared components
import { H3, ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingStaffsForm from './EditListingStaffsForm';
import css from './EditListingStaffsPanel.module.css';

const getInitialValues = params => {
  const { listing } = params;
  const { staffs } = listing?.attributes?.publicData || {};

  return { staffs };
};

const EditListingStaffsPanel = props => {
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
  const isPublished = listing?.id && listing?.attributes?.state !== LISTING_STATE_DRAFT;

  return (
    <div className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingStaffsPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingStaffsPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>
      <EditListingStaffsForm
          initialValues={initialValues}
          onSubmit={values => {
            const { staffs } = values;

            // New values for listing attributes
            const updateValues = {
              publicData: {
                staffs,
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

EditListingStaffsPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingStaffsPanel.propTypes = {
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
  errors: object.isRequired,
};

export default EditListingStaffsPanel;
