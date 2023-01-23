import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

const StripeProvider = ({children}) => {
  // initialize stipe public key
  const stripePromise = loadStripe(process.env.MIX_STRIPE_KEY);

  return (
    // Stipe public key is passed to stripe object as props
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}

export default StripeProvider;

