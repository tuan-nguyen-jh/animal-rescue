import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';

import css from './OrderBreakdown.module.css';

const LineItemService = props => {
  const { intl, service } = props;
  const serviceLabel = <FormattedMessage id="OrderBreakdown.service" />;

  const formattedService = <FormattedMessage id={`OrderBreakdown.service.${service}`} />;

  return (
    <>
      <div className={css.lineItemTotal}>
        <div className={css.totalLabel}>{serviceLabel}</div>
        <div className={css.totalPrice}>{formattedService}</div>
      </div>
      <hr className={css.totalDivider} />
    </>
  );
};

LineItemService.propTypes = {
  intl: intlShape.isRequired,
  service: string.isRequired,
};

export default LineItemService;
