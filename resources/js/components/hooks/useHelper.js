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

  return { isJson, isObject, isDuplicated };
}

export default useHelper;