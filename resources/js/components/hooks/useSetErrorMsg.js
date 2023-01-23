import React, {useState} from 'react';
import useToastify from '../context/ToastifyContext';

const useSetErrorMsg = (initialValue) => {

    const toastify =useToastify();

    const [errorMessage, setErrorMessage] = useState(initialValue);

    const handleApiErrorMessage = (error) => {
        // console.log('handleErrorMessage', error.response.status, error.response.data);
        let arrayErrors = {};
        if(error.response.status === 422 ) {
            const errors = error.response.data.errMessage;
            for (let key in errors) {
                arrayErrors[key] = errors[key] ;
            }
        } else {
            toastify({message: error.response.data.message, type: 'error'});
        }
        setErrorMessage({...arrayErrors});
    }

    return [errorMessage, {setErrorMessage, handleApiErrorMessage}];

}

export default useSetErrorMsg;
