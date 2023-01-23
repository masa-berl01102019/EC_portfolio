import React, {useState} from 'react';

const useInputForm = (initialValue) => {

    const [formData, setFormData] = useState(initialValue);

    const handleFormData = (e) => {
        console.log('handleFormData');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    return [formData, {setFormData, handleFormData}];
}

export default useInputForm;
