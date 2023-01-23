import React, {memo} from 'react';
import Button from '../../atoms/Button/Button';
import InputText from '../../atoms/InputText/InputText';
import styles from './styles.module.css';

const FormWithBtn = ({
    name, 
    type = 'text',
    value, 
    onChange, 
    placeholder, 
    className = '',
    updateMethod,
    deleteMethod,
    createMethod,
    ...props
  }) => {

  return (
    <div className={[styles.flex, className].join(' ')}>
      <InputText
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.mr_4}
          {...props}
      />
      { createMethod ? (
          <Button onClick={createMethod} size='s' color='primary'>追加</Button>
        ) : (
          <>
            <Button onClick={updateMethod} size='s' color='primary' className={styles.mr_4}>編集</Button>
            <Button onClick={deleteMethod} size='s'>削除</Button>
          </>
      )}
    </div>
  );

};

export default FormWithBtn;