import React, {useCallback, useState} from 'react';

const useInputCheckBox = (initialValue = []) => {

    const [checklist, setChecklist] = useState(initialValue);

    const handleCheck = useCallback((e) => {
        // Cast Number type because value passed by e.target.value is string type 
        const value = Number(e.target.value);
        // Check whether ID exists in Arrays already 
        if(checklist.includes(value)) {
            setChecklist(checklist.filter(item => item !== value ));
        } else {
            setChecklist([...checklist, value] );
        }
    }, [checklist]);

    const handleUnCheckAll = useCallback(() => {
        setChecklist([])
    }, []);

    const handleCheckAll = useCallback((multiArr) => {
        const arr = [];
        if(multiArr.length > 0) {
            for(let i = 0; i < multiArr.length; i++ ) {
                if(!checklist.includes(multiArr[i].id)) {
                    arr.push(multiArr[i].id);
                }
            }
            setChecklist([...checklist, ...arr] );
        }
    },[]);

    return [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}];
};

export default useInputCheckBox;
