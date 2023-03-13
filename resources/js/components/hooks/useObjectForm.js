import useHelper from "./useHelper";

const useObjectForm = (formData, setFormData, dispatch) => {

  const { isObject } = useHelper();

  // content-type shuld be 'multipart/form-data' otherwise it can't be send  ex) image file etc 
  const handleSendObjectForm = (sendUrl, callback) => {
    // Create FormData instance
    const params = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      // check whether if value is array type
      if (Array.isArray(value)) {

        for (let i = 0; i < value.length; i++) {
          // check whether if array has multiple objects or not
          if (isObject(value[i])) {
            Object.entries(value[i]).forEach(([key2, value2]) => {
              // FormData can't store array and object types by using append function  ex) × formData.images = [ {id:'1', item_id:'2'...} {id:'2', item_id:'3'...}] 
              // The append function can only assign like a key:value format, so the key should be processed like the below.
              // FormData take null as a string so it has to replace it with a blank
              params.append(key + '[' + i + '][' + key2 + ']', value2 === null ? '' : value2)
            })
          } else {
            // The key should be processed like the below in order to send array type data to server ex) key[]: value
            params.append(key + '[]', value[i] === null ? '' : value[i])
          }
        }
      } else {
        params.append(key, value === null ? '' : value);
      }
    });
    // Axios library has to use post method and set  'multipart/form-data' to request header when it send image files to server.
    dispatch({
      form: params,
      url: sendUrl,
      headers: { 'content-type': 'multipart/form-data' },
      callback: callback
    });
  }

  // Add Object form 
  const handleInsertObjectForm = (table_name, exceptInitilizeColumns = []) => {
    let new_obj = {};
    if (formData[table_name].length > 0) {
      // Copy the beginning of array of a designated object using spread syntax
      new_obj = { ...formData[table_name][0] }
      // Use for loop to initialize object
      for (let key in new_obj) {
        if (exceptInitilizeColumns.includes(key)) continue; // Skip if there is key which doesn't initialize
        new_obj[key] = ''; // initialize value
      }
      setFormData({
        ...formData,
        [table_name]: [
          ...formData[table_name],
          new_obj
        ]
      });
    }
  }

  // Delete Object form ＊TODO: This function has to modify so that it can use against other api
  const handleDeleteObjectForm = (table_name, index, id) => {
    if (formData[table_name].length > 1) {
      // Check whether ID exists because Form which is dynamically added has no id
      if (id) {
        dispatch({
          url: `/api/admin/items/${table_name}/${id}`,
          callback: () => {
            // Delete an index-th object from array
            formData[table_name].splice(index, 1);
            setFormData({
              ...formData
            });
          }
        });
      } else {
        // Delete an index-th object from array
        formData[table_name].splice(index, 1);
        setFormData({
          ...formData
        });
      }
    }
  }

  // Update Object form
  const handleChangeObjectForm = (table_name, index, e) => {
    const name = e.target.name; // name attribute of input is set DB column name
    const recode = formData[table_name][index] // Get index-th object from an array
    if (e.target.files && e.target.files.length > 0) { // Check if it's files
      const file = e.target.files && e.target.files[0]; // Assign a file object to variable
      const imageUrl = URL.createObjectURL(file); // Create a new objectURL
      recode[name] = imageUrl; // Update designated column in index-th object of array * for image preview
      recode['file'] = file; // Add a file column and store the file object.
    } else {
      // Cast string to number
      recode[name] = e.target.value !== '' ? Number(e.target.value) : ''; // update designated column in index-th object of array
    }
    setFormData({
      ...formData,
      [table_name]: [
        ...formData[table_name],
      ]
    });
  }

  return { handleSendObjectForm, handleInsertObjectForm, handleDeleteObjectForm, handleChangeObjectForm };
}

export default useObjectForm;