import React, {useState} from 'react';

const useForm = (initialValue) => {

    const [formData, setFormData] = useState(initialValue);

    const handleFormData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleFormDate = (date, name) => { // Sat Feb 17 2018 14:43:00 GMT+0900 (Timezone)
        let formatted_date = date !== null ? date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) : null;
        setFormData({
            ...formData,
            [name]: formatted_date
        });
    };

    const handleFormCheckbox = (e) => {
        let new_arr;
        const name = e.target.name; // name attribute of input is set DB column name
        const value = Number(e.target.value);
        // Checking if there is Specified DB column name at Array
        if(formData[name].includes(value)) { 
            new_arr = formData[name].filter(item => item !== value );
        } else {
            new_arr = formData[name];
            new_arr.push(value);
        }
        setFormData({
            ...formData,
            [name]: new_arr
        });
    };

    const handleFormFile = (e) => {
        const name = e.target.name; // name attribute of input is set DB column name
        const file = e.target.files[0]; // Assign file object to variable
        const imageUrl = URL.createObjectURL(file); // Create new objectURL
        setFormData({
            ...formData,
            [name]: imageUrl,
            'file': file
        });
    };

    const handleFormCategory = (e) => {
        let new_obj;
        // Child category ID will be clear when parent category ID is changed
        if(e.target.name === 'gender_category') {
            new_obj = {'gender_category': e.target.value, 'main_category': '', 'sub_category': ''};
        } else if (e.target.name === 'main_category') {
            new_obj = {'main_category': e.target.value, 'sub_category': ''};
        } else {
            new_obj = {'sub_category': e.target.value};
        }
        setFormData({
            ...formData,
            ...new_obj
        });
    }

    return [formData, {setFormData, handleFormData, handleFormDate, handleFormCheckbox, handleFormFile, handleFormCategory}];
}

export default useForm;
