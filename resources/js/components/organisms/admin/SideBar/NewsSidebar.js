import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import CheckboxTab from '../../../molecules/Tab/CheckboxTab';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import Button from '../../../atoms/Button/Button';
import useI18next from '../../../context/I18nextContext';

const NewsSidebar = ({
        brands,
        gender_categories,
        tags,
        model,
        onClick
    }) => {

    const params = useRecoilValue(paramState(model));
    const {handleFilter, handleFilterCheckbox, handleSort} = useCreateParams(model);
    const i18next = useI18next();

    return (
      <div className={styles.sidebar}>
        <div className={styles.container}>

          <Text size='l' className={styles.sec_title}>{i18next.t('admin.filter')}</Text>

          <div className={styles.mb_16}>
            <label htmlFor='search'>
                <Text className={styles.mb_8}>{i18next.t('admin.keyword')}</Text>
            </label>
            <InputText 
                type='text' 
                name='search' 
                onBlur={handleFilter} 
                value={params.filter.search} 
                placeholder={i18next.t('admin.news.keyword-ex')}
                className={styles.w_100}
            />
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.news.brand')}</Text>
            <CheckboxTab tabName={i18next.t('admin.news.brand-ex')}>
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
            <Text className={styles.mb_8}>{i18next.t('admin.news.category')}</Text>
            {   gender_categories &&
                  <Pulldown name='gender_category' value={params.filter.gender_category} onChange={handleFilter} defaultOption={i18next.t('admin.news.gender-category-ex')}> 
                      {   gender_categories.map((category) => 
                              <option key={category.id} value={category.id}>{category.category_name}</option>
                          )
                      }
                  </Pulldown>
            }
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.news.related-tag')}</Text>
            <CheckboxTab tabName={i18next.t('admin.news.related-tag-ex')}>
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
            <Text className={styles.mb_8}>{i18next.t('admin.published-status')}</Text>
            <Pulldown name='is_published' value={params.filter.is_published} onChange={handleFilter} defaultOption={i18next.t('admin.not-set')}> 
                <option value={'0'}>{i18next.t('admin.unpublished')}</option>
                <option value={'1'}>{i18next.t('admin.published')}</option>
            </Pulldown>
          </div>

          <div className={styles.mb_32}>
            <DateRangeFilter params={params.filter} model={model}>
                <option value={'posted_at'}>{i18next.t('admin.posted-date')}</option>
                <option value={'modified_at'}>{i18next.t('admin.updated-date')}</option>
            </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>{i18next.t('admin.sort')}</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.posted-date')}</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
                <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
            </Pulldown>
          </div>

          <div>
            <Text className={styles.mb_8}>{i18next.t('admin.updated-date')}</Text>
            <Pulldown name='modified_at' value={params.sort.modified_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
                <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
            </Pulldown>
          </div>
          
          <Button className={styles.close_btn} onClick={onClick}>{i18next.t('admin.close-btn')}</Button>
        </div>
      </div>
    );

};

export default NewsSidebar;