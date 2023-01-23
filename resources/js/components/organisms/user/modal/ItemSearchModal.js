import React, {useEffect} from 'react';
import { useRecoilState } from 'recoil';
import useCreateParams from '../../../hooks/useCreateParams';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';
import CheckboxTab from '../../../molecules/Tab/CheckboxTab';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import {Link} from 'react-router-dom';
import useFetchApiData from "../../../hooks/useFetchApiData";
import { paramState } from '../../../store/paramState';
import { useTranslation } from 'react-i18next';


const ItemSearchModal = ({
      onClick
    }) => {

    const baseUrl = `/api/user/items/option`;
    const model = 'ITEM';
    const [params, setParams] = useRecoilState(paramState(model));
    const {handleFilter, handleFilterCheckbox, handleFilterCategory, handleSort} = useCreateParams(model);
    const {data, errorMessage} = useFetchApiData(baseUrl, model);
    const {brands, gender_categories, main_categories, sub_categories, sizes, colors, tags} = data;
    const { t } = useTranslation();
    
    useEffect(() => {
        if(params.scope === null) {
          setParams({
              paginate: {},
              sort: { 'price' : '', 'posted_at' : '' },
              filter: { 'search' : '',  'tag' : [], 'color' : [], 'size' : [], 'brand' : [], 'gender_category' : '', 'main_category' : '', 'sub_category' : '', 'price_from' : '', 'price_to' : '', 'stock_status': '' },
              scope: model
          });
      }
    },[]);

    return (
        <div className={styles.container}>
        {   errorMessage && errorMessage.httpRequestError ? (
              <Text role='error'>{errorMessage.httpRequestError}</Text>
            ) : (
              <>
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
                      placeholder={t('user.item.keyword-ex')}
                      className={styles.w_100}
                  />
                </div>

                <div className={styles.mb_16}>
                  <Text className={styles.mb_8}>{t('user.item.brand')}</Text>
                  <CheckboxTab tabName={t('user.item.brand-ex')}>
                    <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                      {   brands &&
                          brands.map((brand) =>
                            <label key={brand.id} className={styles.flex_row} style={{'margin': '4px'}}>
                              <InputCheckbox name='brand' value={brand.id} onChange={handleFilterCheckbox} checked={params.filter.brand?.includes(brand.id)} style={{'marginRight': '4px'}}/>
                              <Text>{brand.brand_name}</Text>
                            </label>
                          )
                      }
                    </div>
                  </CheckboxTab>
                  { params.filter.brand && params.filter.brand.length > 0 &&
                    <div className={styles.flex_wrap}>
                      { brands &&
                        brands.filter(list => params.filter.brand?.includes(list.id)).map((brand) =>
                              <CheckboxTag
                                  key={brand.id}
                                  name='brand' 
                                  value={brand.id} 
                                  onChange={handleFilterCheckbox} 
                                  checked={params.filter.brand?.includes(brand.id)} 
                                  label={brand.brand_name}
                                  style={{'margin' : '4px' }}
                              />
                          )
                      }
                    </div>
                  }
                </div>

                <div className={styles.mb_16}>
                  <Text className={styles.mb_8}>{t('user.item.category')}</Text>
                  {   gender_categories && main_categories && sub_categories && 
                      <div className={styles.flex}>
                          <div className={styles.mb_8}>
                              <Pulldown name='gender_category' value={params.filter.gender_category} onChange={handleFilterCategory} defaultOption={t('user.item.gender-category-ex')}> 
                                  {   gender_categories.map((category) => 
                                          <option key={category.id} value={category.id}>{category.category_name}</option>
                                      )
                                  }
                              </Pulldown>
                          </div>
                          <div className={styles.mb_8}>
                              <Pulldown name='main_category' value={params.filter.main_category} onChange={handleFilterCategory} defaultOption={t('user.item.main-category-ex')}> 
                                  {   main_categories.filter((category) => Number(params.filter.gender_category) === category.parent_id).map((category) => (
                                          <option key={category.id} value={category.id}>{category.category_name}</option>
                                      ))
                                  }
                              </Pulldown>
                          </div>
                          <div>
                              <Pulldown name='sub_category' value={params.filter.sub_category} onChange={handleFilterCategory} defaultOption={t('user.item.sub-category-ex')}> 
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
                  <Text className={styles.mb_8}>{t('user.item.size')}</Text>
                  <CheckboxTab tabName={t('user.item.size-ex')}>
                    <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                      {   sizes &&
                          sizes.map((size) =>
                            <label key={size.id} className={styles.flex_row} style={{'margin': '4px'}}>
                              <InputCheckbox name='size' value={size.id} onChange={handleFilterCheckbox} checked={params.filter.size?.includes(size.id)} style={{'marginRight': '4px'}}/>
                              <Text>{size.size_name}</Text>
                            </label>
                          )
                      }
                    </div>
                  </CheckboxTab>
                  { params.filter.size && params.filter.size.length > 0 &&
                    <div className={styles.flex_wrap}>
                      { sizes &&
                        sizes.filter(list => params.filter.size?.includes(list.id)).map((size) =>
                            <CheckboxTag
                              key={size.id}
                              name='size' 
                              value={size.id} 
                              onChange={handleFilterCheckbox} 
                              checked={params.filter.size?.includes(size.id)} 
                              label={size.size_name}
                              style={{'margin' : '4px'}}
                            />
                          )
                      }
                    </div>
                  }
                </div>

                <div className={styles.mb_16}>
                  <Text className={styles.mb_8}>{t('user.item.color')}</Text>
                  <CheckboxTab tabName={t('user.item.color-ex')}>
                    <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                      {   colors &&
                          colors.map((color) =>
                            <label key={color.id} className={styles.flex_row} style={{'margin': '4px'}}>
                              <InputCheckbox name='color' value={color.id} onChange={handleFilterCheckbox} checked={params.filter.color?.includes(color.id)} style={{'marginRight': '4px'}}/>
                              <Text>{color.color_name}</Text>
                            </label>
                          )
                      }
                    </div>
                  </CheckboxTab>
                  { params.filter.color && params.filter.color.length > 0 &&
                    <div className={styles.flex_wrap}>
                      {   colors &&
                          colors.filter(list => params.filter.color?.includes(list.id)).map((color) =>
                              <CheckboxTag
                                  key={color.id}
                                  name='color' 
                                  value={color.id} 
                                  onChange={handleFilterCheckbox} 
                                  checked={params.filter.color?.includes(color.id)} 
                                  label={color.color_name}
                                  style={{'margin' : '4px'}}
                              />
                          )
                      }
                    </div>
                  }
                </div>

                <div className={styles.mb_16}>
                  <Text className={styles.mb_8}>{t('user.item.tag')}</Text>
                  <CheckboxTab tabName={t('user.item.tag-ex')}>
                    <div className={[styles.flex_column, styles.scroll_area].join(' ')}>
                      {   tags && 
                          tags.map((tag) =>
                              <label key={tag.id} className={styles.flex_row} style={{'margin': '4px'}}>
                                <InputCheckbox name='tag' value={tag.id} onChange={handleFilterCheckbox} checked={params.filter.tag?.includes(tag.id)} style={{'marginRight': '4px'}}/>
                                <Text>{tag.tag_name}</Text>
                              </label>
                          )
                      }
                    </div>
                  </CheckboxTab>
                  { params.filter.tag && params.filter.tag.length > 0 &&
                    <div className={styles.flex_wrap}>
                      { tags &&
                        tags.filter(list => params.filter.tag?.includes(list.id)).map((tag) =>
                          <CheckboxTag
                              key={tag.id}
                              name='tag' 
                              value={tag.id} 
                              onChange={handleFilterCheckbox} 
                              checked={params.filter.tag?.includes(tag.id)} 
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
                    <Text className={styles.mb_8}>{t('user.item.price-range')}</Text>
                  </label>
                  <div className={[styles.flex_row, styles.align_center].join(' ')}>
                    <InputText 
                        type='number' 
                        name='price_from' 
                        onBlur={handleFilter} 
                        value={params.filter.price_from} 
                        placeholder={t('user.item.price-low-ex')}
                        className={styles.w_100}
                    />
                    <Text className={styles.ma}>~</Text>
                    <InputText 
                        type='number' 
                        name='price_to' 
                        onBlur={handleFilter} 
                        value={params.filter.price_to} 
                        placeholder={t('user.item.price-high-ex')}
                        className={styles.w_100}
                    />
                  </div>
                </div>

                <div className={styles.mb_32}>
                  <Text className={styles.mb_8}>{t('user.item.stock-status')}</Text>
                  <Pulldown name='stock_status' value={params.filter.stock_status} onChange={handleFilter} defaultOption={t('user.not-set')}>
                      <option value={'0'}>{t('user.item.all')}</option>
                      <option value={'1'}>{t('user.item.stock-only')}</option>
                  </Pulldown>
                </div>

                <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{t('user.set-sort')}</Text>

                <div className={styles.mb_16}>
                  <Text className={styles.mb_8}>{t('user.item.price')}</Text>
                  <Pulldown name='price' value={params.sort.price} onChange={handleSort} defaultOption={t('user.not-set')}>
                      <option value={'desc'}>{t('user.desc-num')}</option>
                      <option value={'asc'}>{t('user.asc-num')}</option>
                  </Pulldown>
                </div>

                <div className={styles.mb_32}>
                  <Text className={styles.mb_8}>{t('user.posted-date')}</Text>
                  <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort} defaultOption={t('user.not-set')}>
                      <option value={'desc'}>{t('user.desc-date')}</option>
                      <option value={'asc'}>{t('user.asc-date')}</option>
                  </Pulldown>
                </div>
                
                <div className={[styles.flex_row, styles.justify_center].join(' ')}>
                  <Button className={styles.mr_8} onClick={onClick}>{t('user.close-btn')}</Button>
                  <Button color='primary' onClick={onClick}>
                    <Link to={{pathname: "/items", state: params}} style={{'color': '#fff'}}>{t('user.search-btn')}</Link>
                  </Button>
                </div>
              </>
            )
        }
        </div>
    );
};

export default ItemSearchModal;