import React from 'react';
import { Heading } from '../../components';

import css from './ListingPage.module.css';


const SectionJSONMaybe = props => {
  const { json, heading, showAsIngress = false } = props;
  const textClass = showAsIngress ? css.ingress : css.text;

  return json ? (
    <div className={css.sectionText}>
      {heading ? (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {heading}
        </Heading>
      ) : null}
      {json.map((contact, index) => {
        return (
          <div className={textClass} key={index}>
            <p>Email: {contact.email}</p>
            <p>Phone Number: {contact.phoneNumber}</p>
          </div>
        )
      })}
    </div>
  ) : null;
};

export default SectionJSONMaybe;
