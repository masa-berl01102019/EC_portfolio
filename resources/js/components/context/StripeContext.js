import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

const StripeProvider = ({children}) => {

  // stipeの初期化 公開キーを設定
  const stripePromise = loadStripe('pk_test_51KsaLtCwHY0FaQM1CZfQqsBHTL9ozUN0xvyJFSZxNBn2tEMr1btdGm43cMvJ7CtN8yfOAWHDQVlvpjuRIf3RCoZt008wwWJgVr');

  return (
    // stripeのオブジェクトをpropsで要素に渡す
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}

export default StripeProvider;

