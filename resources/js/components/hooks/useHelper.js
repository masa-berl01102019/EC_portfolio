import React from 'react';

const useHelper = () => {

  // JSON判定用の関数
  const isJson = (data) => {
    console.log('isJson');
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
  }

  // objecy判定用の関数
  const isObject = (val) => {
      console.log('isObject');
      if( val !== null && typeof(val) === 'object' && val.constructor === Object ) {
          return true;
      }
      return false;
  }

  return {isJson, isObject};
}

export default useHelper;