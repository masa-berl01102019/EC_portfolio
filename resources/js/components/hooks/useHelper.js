import React from 'react';

const useHelper = () => {

  // JSON判定用の関数
  const isJson = (data) => {
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
  }

  // objecy判定用の関数
  const isObject = (val) => {
      if( val !== null && typeof(val) === 'object' && val.constructor === Object ) {
          return true;
      }
      return false;
  }

  // checking whether there is duplicate value
  const isDuplicated  = (arr) => {
    const new_arr = new Set(arr);
    return new_arr.size != arr.length;
  }

  return {isJson, isObject, isDuplicated};
}

export default useHelper;