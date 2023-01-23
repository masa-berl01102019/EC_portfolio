import React, {memo, useRef} from 'react';
import Button from '../../atoms/Button/Button';
import InputText from '../../atoms/InputText/InputText';
import Text from '../../atoms/Text/Text';
import useForm from '../../hooks/useForm';
import useValidation from '../../hooks/useValidation';
import styles from './styles.module.css';
import useI18next from '../../context/I18nextContext';

const FormWithBtn = ({
    name, 
    placeholder, 
    formInitialValue,
    validateScope,
    validateConfigKey,
    requestUrl,
    createMethod,
    updateMethod,
    deleteMethod,
    className = '',
    ...props
  }) => {

    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, setFormData}] = useForm(formInitialValue);
    // フロント用バリデーション
    const {valid, setValid, validation, errorObject} = useValidation(formData, validateScope, validateConfigKey);
    // formの値をuseRefで管理
    const inputValue = useRef(undefined);
    const i18next = useI18next();

  return (
    <div className={className}>
      <div className={styles.flex}>
        <InputText
            name={name}
            value={formData[name]}
            onChange={handleFormData}
            placeholder={placeholder}
            className={styles.mr_4}
            ref={inputValue}
            {...props}
        />
        { createMethod ? (
            <Button onClick={() => {
              setFormData({...formData, [name]: inputValue.current?.value});
              if(validation.fails()) {
                setValid(true);
                return false;
              }
              createMethod({form: formData, url: requestUrl});
            }} size='s' color='primary'>{i18next.t('admin.add-btn')}</Button>
          ) : (
            <>
              <Button onClick={() => {
                  setFormData({...formData, [name]: inputValue.current?.value});
                  if(validation.fails()) {
                    setValid(true);
                    return false;
                  }
                  updateMethod({form: formData, url: requestUrl});
              }} size='s' color='primary' className={styles.mr_4}>{i18next.t('admin.edit-link')}</Button>
              <Button onClick={deleteMethod} size='s'>{i18next.t('admin.delete-btn')}</Button>
            </>
        )}
      </div>
      { valid && validation.fails() && validation.errors.first(name) && 
          <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')}>
              {validation.errors.first(name)}
          </Text> 
      }
    </div>
  );

};

export default FormWithBtn;