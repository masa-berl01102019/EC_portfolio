import React from 'react';

const useHelper = () => {

  // Function for Checking if it is JSON 
  const isJson = (data) => {
    try {
      JSON.parse(data);
    } catch (error) {
      return false;
    }
    return true;
  }

  // Function for Checking if it is object 
  const isObject = (val) => {
    if (val !== null && typeof (val) === 'object' && val.constructor === Object) {
      return true;
    }
    return false;
  }

  // Checking whether there is duplicate value in Array
  const isDuplicated = (arr) => {
    const new_arr = new Set(arr);
    return new_arr.size != arr.length;
  }

  // Function for Checking if it is null, undefined, '' and 0 
  const check = (val) => {
    if (val) {
      if (val.trim() !== '') {
        return true;
      }
    }
    return false;
  }

  return { isJson, isObject, isDuplicated, check };
}

export default useHelper;