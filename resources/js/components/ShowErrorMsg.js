import React from 'react';

const ShowErrorMsg = (props) => {

    return (
        <ul style={{'color': 'red', 'listStyle': 'none'}}>
            {
                props.errorMessage.map((err, index) => (
                    <li key={index}>{err}</li>
                ))
            }
        </ul>
    );
}

export default ShowErrorMsg;
