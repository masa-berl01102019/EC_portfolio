import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

// TODO: read .env file

const StripeProvider = ({children}) => {
  // initialize stipe public key
  const stripePromise = loadStripe('pk_test_51KsaLtCwHY0FaQM1CZfQqsBHTL9ozUN0xvyJFSZxNBn2tEMr1btdGm43cMvJ7CtN8yfOAWHDQVlvpjuRIf3RCoZt008wwWJgVr');

  return (
    // Stipe public key is passed to stripe object as props
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}

export default StripeProvider;

