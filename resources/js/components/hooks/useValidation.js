import React, {useState} from 'react';
import * as Validator from 'validatorjs';
import {validationConfig} from '../validation/config';

const useValidation = (data, scope, config_key) => {

  const [valid, setValid] = useState(false);

  const validation = new Validator(data, validationConfig[scope][config_key].rules);

  Validator.useLang('ja');

  validation.setAttributeNames(validationConfig[scope][config_key].attributes);

  const errorObject = {};

  if(validation.fails()) {
    Object.entries(validation.errors.all()).forEach(([key, value]) => {
      const correctKey = key.replace(/\d/, '*');
      const correctAttribute = validationConfig[scope][config_key].attributes[correctKey];
      const correctVlue = value.join('').replace(key.replace(/_/g, ' '), correctAttribute);
      errorObject[correctKey] = correctVlue;
    });
  }

  return {valid, setValid, validation, errorObject};
}

export default useValidation;