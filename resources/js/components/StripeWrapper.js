import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CartConfirmPage from './pages/user/carts/CartConfirmPage';

// initialize stipe public key
const stripePromise = loadStripe(process.env.MIX_STRIPE_KEY);

const StripeWrapper = () => {
  return (
    // Stipe public key is passed to stripe object as props
    <Elements stripe={stripePromise}>
      <CartConfirmPage />
    </Elements>
  );
}

export default StripeWrapper;