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
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import CheckboxTab from '../../../molecules/Tab/CheckboxTab';
import { useTranslation } from 'react-i18next';

const BlogFilterModal = ({
      brands,
      gender_categories,
      items,
      tags,
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
                placeholder={t('user.blog.keyword-ex')}
                className={styles.w_100}
            />
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.blog.brand')}</Text>
            <CheckboxTab tabName={t('user.blog.brand-ex')}>
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
            <Text className={styles.mb_8}>{t('user.blog.category')}</Text>
            {   gender_categories &&
                  <Pulldown name='gender_category' value={params.filter.gender_category} onChange={handleFilter} defaultOption={t('user.blog.gender-category-ex')}> 
                      {   gender_categories.map((category) => 
                              <option key={category.id} value={category.id}>{category.category_name}</option>
                          )
                      }
                  </Pulldown>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.blog.product-number')}</Text>
            <CheckboxTab tabName={t('user.blog.product-number-ex')}>
              <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                {   items &&
                    items.map((item) =>
                    <label key={item.id} className={styles.flex_row} style={{'margin': '4px'}}>
                          <InputCheckbox name='item' value={item.id} onChange={handleFilterCheckbox} checked={params.filter.item.includes(item.id)} style={{'marginRight': '4px'}}/>
                          <Text>{item.product_number}</Text>
                        </label>
                    )
                }
              </div>
            </CheckboxTab>
            { params.filter.item.length > 0 &&
              <div className={styles.flex_wrap}>
                { items &&
                  items.filter(list => params.filter.item.includes(list.id)).map((item) =>
                        <CheckboxTag
                            key={item.id}
                            name='item' 
                            value={item.id} 
                            onChange={handleFilterCheckbox} 
                            checked={params.filter.item.includes(item.id)} 
                            label={item.product_number}
                            style={{'margin' : '4px' }}
                        />
                    )
                }
              </div>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.blog.related-tag')}</Text>
            <CheckboxTab tabName={t('user.blog.related-tag-ex')}>
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

          <Button className={styles.close_btn} onClick={onClick}>{t('user.close-btn')}</Button>

        </div>
      </Mask>


    );

};

export default BlogFilterModal;