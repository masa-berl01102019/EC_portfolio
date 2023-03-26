import React, { useState } from 'react';
import * as Validator from 'validatorjs';
import validationConfig from '../validation/config';

const useValidation = (data, scope, config_key) => {

  const config = validationConfig();

  const [valid, setValid] = useState(false);

  Validator.useLang(localStorage.getItem('lang') || 'ja');

  const validation = new Validator(data, config[scope][config_key].rules);

  validation.setAttributeNames(config[scope][config_key].attributes);

  const errorObject = {};

  if (validation.fails()) {
    Object.entries(validation.errors.all()).forEach(([key, value]) => {
      const correctKey = key.replace(/\d+/, '*');
      const correctAttribute = config[scope][config_key].attributes[correctKey];
      // Get one error if there are multiple error for the same key
      const correctVlue = value[0].replace(key.replace(/_/g, ' '), correctAttribute);
      errorObject[correctKey] = correctVlue;
    });
  }

  return { valid, setValid, validation, errorObject };
}

export default useValidation;