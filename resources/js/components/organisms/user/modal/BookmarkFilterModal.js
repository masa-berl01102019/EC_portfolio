import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import InputText from '../../../atoms/InputText/InputText';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../../atoms/Mask/Mask';
import Button from '../../../atoms/Button/Button';
import CheckboxTab from '../../../molecules/Tab/CheckboxTab';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import { useTranslation } from 'react-i18next';

const BookmarkFilterModal = ({
      brands,
      sizes,
      colors,
      onClick,
      model
    }) => {

    const params = useRecoilValue(paramState(model));
    const {handleFilter, handleFilterCheckbox} = useCreateParams(model);
    const { t } = useTranslation();

    return (
      <Mask>
        <div className={styles.container}>

          <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{t('user.set-filter')}</Text>

          <div className={styles.mb_16}>
            <label htmlFor='search'>
                <Text className={styles.mb_8}>{t('user.keyword')}</Text>
            </label>
            <InputText 
                type='text' 
                name='search' 
                onBlur={handleFilter} 
                value={params.filter.search} 
                placeholder={t('user.bookmark.keyword-ex')}
                className={styles.w_100}
            />
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.bookmark.brand')}</Text>
            <CheckboxTab tabName={t('user.bookmark.brand-ex')}>
              <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                {   brands &&
                    brands.map((brand) =>
                      <label key={brand.id} className={styles.flex_row} style={{'margin': '4px'}}>
                        <InputCheckbox name='brand' value={brand.id} onChange={handleFilterCheckbox} checked={params.filter.brand.includes(brand.id)} style={{'marginRight': '4px'}}/>
                        <Text>{brand.brand_name}</Text>
                      </label>
                    )
                }
              </div>
            </CheckboxTab>
            { params.filter.brand.length > 0 &&
              <div className={styles.flex_wrap}>
                { brands &&
                  brands.filter(list => params.filter.brand.includes(list.id)).map((brand) =>
                        <CheckboxTag
                            key={brand.id}
                            name='brand' 
                            value={brand.id} 
                            onChange={handleFilterCheckbox} 
                            checked={params.filter.brand.includes(brand.id)} 
                            label={brand.brand_name}
                            style={{'margin' : '4px'}}
                        />
                    )
                }
              </div>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.bookmark.size')}</Text>
            <CheckboxTab tabName={t('user.bookmark.size-ex')}>
              <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                {   sizes &&
                    sizes.map((size) =>
                      <label key={size.id} className={styles.flex_row} style={{'margin': '4px'}}>
                        <InputCheckbox name='size' value={size.id} onChange={handleFilterCheckbox} checked={params.filter.size.includes(size.id)} style={{'marginRight': '4px'}}/>
                        <Text>{size.size_name}</Text>
                      </label>
                    )
                }
              </div>
            </CheckboxTab>
            { params.filter.size.length > 0 &&
              <div className={styles.flex_wrap}>
                { sizes &&
                  sizes.filter(list => params.filter.size.includes(list.id)).map((size) =>
                      <CheckboxTag
                        key={size.id}
                        name='size' 
                        value={size.id} 
                        onChange={handleFilterCheckbox} 
                        checked={params.filter.size.includes(size.id)} 
                        label={size.size_name}
                        style={{'margin' : '4px'}}
                      />
                    )
                }
              </div>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.bookmark.color')}</Text>
            <CheckboxTab tabName={t('user.bookmark.color-ex')}>
              <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                {   colors &&
                    colors.map((color) =>
                      <label key={color.id} className={styles.flex_row} style={{'margin': '4px'}}>
                        <InputCheckbox name='color' value={color.id} onChange={handleFilterCheckbox} checked={params.filter.color.includes(color.id)} style={{'marginRight': '4px'}}/>
                        <Text>{color.color_name}</Text>
                      </label>
                    )
                }
              </div>
            </CheckboxTab>
            { params.filter.color.length > 0 &&
              <div className={styles.flex_wrap}>
                {   colors &&
                    colors.filter(list => params.filter.color.includes(list.id)).map((color) =>
                        <CheckboxTag
                            key={color.id}
                            name='color' 
                            value={color.id} 
                            onChange={handleFilterCheckbox} 
                            checked={params.filter.color.includes(color.id)} 
                            label={color.color_name}
                            style={{'margin' : '4px'}}
                        />
                    )
                }
              </div>
            }
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{t('user.close-btn')}</Button>
          
        </div>
      </Mask>


    );

};

export default BookmarkFilterModal;