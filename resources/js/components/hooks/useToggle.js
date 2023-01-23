import React, {useState} from 'react';

const useToggle = (initialValue) => {

    const [toggle, setToggle] = useState(initialValue);

    const handleToggle = () => {
        console.log('handleToggle');
        setToggle(prevState => !prevState);
    }

    return [toggle, {handleToggle}];
}

export default useToggle;
