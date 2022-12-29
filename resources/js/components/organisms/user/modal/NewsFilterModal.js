import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../../atoms/Mask/Mask';
import Button from '../../../atoms/Button/Button';
import CheckboxTab from '../../../molecules/Tab/CheckboxTab';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import useI18next from '../../../context/I18nextContext';

const NewsFilterModal = ({
      brands,
      gender_categories,
      tags,
      onClick,
      model
    }) => {

    const params = useRecoilValue(paramState(model));
    const {handleFilter, handleFilterCheckbox} = useCreateParams(model);
    const i18next = useI18next();

    return (
      <Mask>
        <div className={styles.container}>

          <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{i18next.t('user.set-filter')}</Text>

          <div className={styles.mb_16}>
            <label htmlFor='search'>
                <Text className={styles.mb_8}>{i18next.t('user.keyword')}</Text>
            </label>
            <InputText 
                type='text' 
                name='search' 
                onBlur={handleFilter} 
                value={params.filter.search} 
                placeholder={i18next.t('user.news.keyword-ex')}
                className={styles.w_100}
            />
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.news.brand')}</Text>
            <CheckboxTab tabName={i18next.t('user.news.brand-ex')}>
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
                            style={{'margin' : '4px' }}
                        />
                    )
                }
              </div>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.news.category')}</Text>
            {   gender_categories &&
                <Pulldown name='gender_category' value={params.filter.gender_category} onChange={handleFilter} defaultOption={i18next.t('user.news.gender-category-ex')}> 
                    {   gender_categories.map((category) => 
                            <option key={category.id} value={category.id}>{category.category_name}</option>
                        )
                    }
                </Pulldown>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.news.related-tag')}</Text>
            <CheckboxTab tabName={i18next.t('user.news.related-tag-ex')}>
              <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                {   tags &&
                    tags.map((tag) =>
                        <label key={tag.id} className={styles.flex_row} style={{'margin': '4px'}}>
                          <InputCheckbox name='tag' value={tag.id} onChange={handleFilterCheckbox} checked={params.filter.tag.includes(tag.id)} style={{'marginRight': '4px'}}/>
                          <Text>{tag.tag_name}</Text>
                        </label>
                    )
                }
              </div>
            </CheckboxTab>
            { params.filter.tag.length > 0 &&
              <div className={styles.flex_wrap}>
                { tags &&
                  tags.filter(list => params.filter.tag.includes(list.id)).map((tag) =>
                    <CheckboxTag
                        key={tag.id}
                        name='tag' 
                        value={tag.id} 
                        onChange={handleFilterCheckbox} 
                        checked={params.filter.tag.includes(tag.id)} 
                        label={tag.tag_name}
                        style={{'margin' : '4px' }}
                    />
                  )
                }
              </div>
            }
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{i18next.t('user.close-btn')}</Button>

        </div>
      </Mask>


    );

};

export default NewsFilterModal;