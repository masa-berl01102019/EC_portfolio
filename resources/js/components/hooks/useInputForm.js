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

    const handleDateChange = (date, name) => { // Sat Feb 17 2018 14:43:00 GMT+0900 (日本標準時)の形式で値が渡ってくる
        console.log('handleDateChange');
        // date型に合わせてフォーマット
        let formatted_date = date !== null ? date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) : null;
        setFormData({
            ...formData,
            [name]: formatted_date
        });
    };

    return [formData, {setFormData, handleFormData, handleDateChange}];
}

export default useInputForm;
