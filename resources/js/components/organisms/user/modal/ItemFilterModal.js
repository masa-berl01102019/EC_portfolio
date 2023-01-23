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

const ItemFilterModal = ({
      brands,
      gender_categories,
      main_categories,
      sub_categories,
      sizes,
      colors,
      tags,
      onClick,
      model
    }) => {

    const params = useRecoilValue(paramState(model));
    const {handleFilter, handleFilterCheckbox, handleFilterCategory, handleSort} = useCreateParams(model);
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
                placeholder={i18next.t('user.item.keyword-ex')}
                className={styles.w_100}
            />
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.item.brand')}</Text>
            <CheckboxTab tabName={i18next.t('user.item.brand-ex')}>
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
            <Text className={styles.mb_8}>{i18next.t('user.item.category')}</Text>
            {   gender_categories && main_categories && sub_categories && 
                <div className={styles.flex}>
                    <div className={styles.mb_8}>
                        <Pulldown name='gender_category' value={params.filter.gender_category} onChange={handleFilterCategory} defaultOption={i18next.t('user.item.gender-category-ex')}> 
                            {   gender_categories.map((category) => 
                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                )
                            }
                        </Pulldown>
                    </div>
                    <div className={styles.mb_8}>
                        <Pulldown name='main_category' value={params.filter.main_category} onChange={handleFilterCategory} defaultOption={i18next.t('user.item.main-category-ex')}> 
                            {   main_categories.filter((category) => Number(params.filter.gender_category) === category.parent_id).map((category) => (
                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                ))
                            }
                        </Pulldown>
                    </div>
                    <div>
                        <Pulldown name='sub_category' value={params.filter.sub_category} onChange={handleFilterCategory} defaultOption={i18next.t('user.item.sub-category-ex')}> 
                            {   sub_categories.filter((category) => Number(params.filter.main_category) === category.parent_id).map((category) => (
                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                ))
                            }
                        </Pulldown>
                    </div>
                </div>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.item.size')}</Text>
            <CheckboxTab tabName={i18next.t('user.item.size-ex')}>
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
            <Text className={styles.mb_8}>{i18next.t('user.item.color')}</Text>
            <CheckboxTab tabName={i18next.t('user.item.color-ex')}>
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

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.item.tag')}</Text>
            <CheckboxTab tabName={i18next.t('user.item.tag-ex')}>
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

          <div className={styles.mb_16}>
            <label htmlFor='price_from'>
              <Text className={styles.mb_8}>{i18next.t('user.item.price-range')}</Text>
            </label>
            <div className={[styles.flex_row, styles.align_center].join(' ')}>
              <InputText 
                  type='number' 
                  name='price_from' 
                  onBlur={handleFilter} 
                  value={params.filter.price_from} 
                  placeholder={i18next.t('user.item.price-low-ex')}
                  className={styles.w_100}
              />
              <Text className={styles.ma}>~</Text>
              <InputText 
                  type='number' 
                  name='price_to' 
                  onBlur={handleFilter} 
                  value={params.filter.price_to} 
                  placeholder={i18next.t('user.item.price-high-ex')}
                  className={styles.w_100}
              />
            </div>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.item.stock-status')}</Text>
            <Pulldown name='stock_status' value={params.filter.stock_status} onChange={handleFilter} defaultOption={i18next.t('user.not-set')}>
                <option value={'0'}>{i18next.t('user.item.all')}</option>
                <option value={'1'}>{i18next.t('user.item.stock-only')}</option>
            </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{i18next.t('user.close-btn')}</Button>

        </div>
      </Mask>


    );

};

export default ItemFilterModal;