import React, { memo, useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';
import Text from '../../atoms/Text/Text';

const Pulldown = ({ children, name, value, onChange, className = '', defaultOption = true, initialLabel }) => {

  const [open, setOpen] = useState(false);
  const [select, setSlect] = useState(value);
  const { t } = useTranslation();

  useEffect(() => {
    if (value === '') {
      setSlect(initialLabel || '')
    } else {
      // Children props are Array type if it's multiple elements. 
      let defaultValue = Array.isArray(children) ? children.filter(child => child.props.value == value).map(el => el.props.children).join('') : null;
      setSlect(defaultValue)
    }
  }, [value])

  return (
    <div className={[styles.container, className].join(' ')}>
      <div className={[styles.base_select, open ? styles.select_open : styles.select_close].join(' ')} onClick={() => setOpen(!open)}>
        <Text>{select || initialLabel}</Text>
      </div>
      {open == true &&
        <ul className={styles.ul}>
          {defaultOption &&
            <li>
              <Text tag='label' className={styles.label}>
                <input
                  type='radio'
                  name={name}
                  value={''}
                  onChange={e => { onChange(e); setSlect(initialLabel); setOpen(false) }}
                  className={styles.hidden}
                />
                {t('admin.not-set')}
              </Text>
            </li>
          }
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <li key={index} className={styles.list}>
                <Text tag='label' className={styles.label}>
                  <input
                    type='radio'
                    name={name}
                    value={child.props.value}
                    onChange={e => { onChange(e); setSlect(child.props.children); setOpen(false) }}
                    className={styles.hidden}
                  />
                  {child.props.children}
                </Text>
              </li>
            ))
          ) : (
            <li className={styles.list}>
              <Text tag='label' className={styles.label}>
                <input
                  type='radio'
                  name={name}
                  value={children.props.value}
                  onChange={e => { onChange(e); setSlect(children.props.children); setOpen(false) }}
                  className={styles.hidden}
                />
                {children.props.children}
              </Text>
            </li>
          )}
        </ul>
      }
    </div>
  );
};

export default Pulldown;