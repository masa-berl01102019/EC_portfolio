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

const ItemSidebar = ({
        brands,
        gender_categories,
        main_categories,
        sub_categories,
        sizes,
        colors,
        tags,
        model,
        onClick
    }) => {

    // グローバルステート呼び出し
    const params = useRecoilValue(paramState(model));
    // URLパラメータ変更のフックの呼び出し
    const {handleFilter, handleFilterCheckbox, handleFilterCategory, handleSort} = useCreateParams(model);

    return (
      <div className={styles.sidebar}>
        <div className={styles.container}>

          <Text size='l' className={styles.sec_title}>フィルター条件</Text>

          <div className={styles.mb_16}>
            <label htmlFor='search'>
                <Text className={styles.mb_8}>キーワード検索</Text>
            </label>
            <InputText 
                type='text' 
                name='search' 
                onBlur={handleFilter} 
                value={params.filter.search} 
                placeholder={'商品名もしくは品番で検索'}
                className={styles.w_100}
            />
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>ブランド</Text>
            <CheckboxTab tabName='ブランドを追加'>
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
            <Text className={styles.mb_8}>カテゴリ</Text>
            {   gender_categories && main_categories && sub_categories && 
                <div className={styles.flex_column}>
                    <div className={styles.mb_8}>
                        <Pulldown name='gender_category' value={params.filter.gender_category} onChange={handleFilterCategory} defaultOption={'性別カテゴリを選択'}> 
                            {   gender_categories.map((category) => 
                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                )
                            }
                        </Pulldown>
                    </div>
                    <div className={styles.mb_8}>
                        <Pulldown name='main_category' value={params.filter.main_category} onChange={handleFilterCategory} defaultOption={'メインカテゴリを選択'}> 
                            {   main_categories.filter((category) => Number(params.filter.gender_category) === category.parent_id).map((category) => (
                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                ))
                            }
                        </Pulldown>
                    </div>
                    <div>
                        <Pulldown name='sub_category' value={params.filter.sub_category} onChange={handleFilterCategory} defaultOption={'サブカテゴリを選択'}> 
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
            <Text className={styles.mb_8}>サイズ</Text>
            <CheckboxTab tabName='サイズを追加'>
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
            <Text className={styles.mb_8}>カラー</Text>
            <CheckboxTab tabName='カラーを追加'>
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
            <Text className={styles.mb_8}>関連タグ</Text>
            <CheckboxTab tabName='タグを追加'>
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
            <Text className={styles.mb_8}>公開状況</Text>
            <Pulldown name='is_published' value={params.filter.is_published} onChange={handleFilter} > 
                <option value={'0'}>非公開</option>
                <option value={'1'}>公開中</option>
            </Pulldown>
          </div>

          <div className={styles.mb_16}>
            <DateRangeFilter params={params.filter} model={model}>
                <option value={'posted_at'}>投稿日</option>
                <option value={'modified_at'}>更新日</option>
            </DateRangeFilter>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>在庫の有無</Text>
            <Pulldown name='stock_status' value={params.filter.stock_status} onChange={handleFilter}>
                <option value={'0'}>すべて</option>
                <option value={'1'}>在庫あり</option>
            </Pulldown>
          </div>

          <div className={styles.mb_32}>
            <label htmlFor='price_from'>
              <Text className={styles.mb_8}>価格帯</Text>
            </label>
            <div className={[styles.flex_row, styles.align_center].join(' ')}>
              <InputText 
                  type='number' 
                  name='price_from' 
                  onBlur={handleFilter} 
                  value={params.filter.price_from} 
                  placeholder={'価格下限を設定'}
                  className={styles.w_100}
              />
              <Text className={styles.ma}>~</Text>
              <InputText 
                  type='number' 
                  name='price_to' 
                  onBlur={handleFilter} 
                  value={params.filter.price_to} 
                  placeholder={'価格上限を設定'}
                  className={styles.w_100}
              />
            </div>
          </div>

          <Text size='l' className={styles.sec_title}>ソート条件</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>品番</Text>
            <Pulldown name='product_number' value={params.sort.product_number} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>商品名</Text>
            <Pulldown name='item_name' value={params.sort.item_name} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>価格</Text>
            <Pulldown name='price' value={params.sort.price} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>原価</Text>
            <Pulldown name='cost' value={params.sort.cost} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>投稿日</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>

          <div>
            <Text className={styles.mb_8}>更新日</Text>
            <Pulldown name='modified_at' value={params.sort.modified_at} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>
          
          <Button className={styles.close_btn} onClick={onClick} >閉じる</Button>
        </div>
      </div>
    );

};

export default ItemSidebar;