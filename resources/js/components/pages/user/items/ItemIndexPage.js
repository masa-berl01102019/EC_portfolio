import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useParamsContext } from '../../../context/ParamsContext';

function ItemIndexPage() {

    // urlの設定
    const baseUrl = `/api/user/items`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ITEM';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleFilterDateRange, handleFilterCategory, handleCurrentPage, handlePerPage, handleSort}] = useCreateParams();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);

    // APIから取得したデータを変数に格納
    const items = data.data? data.data: null;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const main_categories = data.main_categories? data.main_categories: null;
    const sub_categories = data.sub_categories? data.sub_categories: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const tags = data.tags? data.tags: null;


    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('ITEMにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'item_name' : '', 'price' : '', 'posted_at' : '', 'modified_at' : ''},
                filter: { 'keyword' : '', 'tag' : [], 'color' : [], 'size' : [], 'brand' : [], 'gender_category' : '', 'main_category' : '', 'sub_category' : '', 'dateRange': {} },
            });
            setScope(model);
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <>
                <h1>商品一覧</h1>

                {   Object.keys(params.filter).length > 0 && scope === model &&
                    <div className={'filter'}>
                        <h3>フィルター機能</h3>
                        <div>
                            <span>キーワード検索</span>
                            <input type='text' name='keyword' onBlur={handleFilter} defaultValue={params.filter.keyword} placeholder={'商品名を検索'}/>
                        </div>
                        <div>
                            <span style={{'marginRight': '20px'}}>ブランド</span>
                            {   brands &&
                                brands.map((brand) =>
                                    <label key={brand.id} ><input type='checkbox' name='brand' onChange={handleFilterCheckbox} value={brand.id} checked={params.filter.brand.includes(brand.id)} />{brand.brand_name}</label>
                                )
                            }
                        </div>
                        <div>
                            <span style={{'marginRight': '20px'}}>カテゴリ</span>
                            {   gender_categories && main_categories && sub_categories && (
                                <>
                                    <select name='gender_category' value={params.filter.gender_category} onChange={handleFilterCategory}>
                                        <option value={''}>性別カテゴリを選択</option>
                                        { gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                                    </select>
                                    <select name='main_category' value={params.filter.main_category} onChange={handleFilterCategory}>
                                        <option value={''}>メインカテゴリを選択</option>
                                        {   main_categories.filter((category) => Number(params.filter.gender_category) === category.parent_id).map((category) => (
                                                <option key={category.id} value={category.id}>{category.category_name}</option>
                                            ))
                                        }
                                    </select>
                                    <select name='sub_category' value={params.filter.sub_category} onChange={handleFilterCategory}>
                                        <option value={''}>サブカテゴリを選択</option>
                                        {   sub_categories.filter((category) => Number(params.filter.main_category) === category.parent_id).map((category) => (
                                                <option key={category.id} value={category.id}>{category.category_name}</option>
                                            ))
                                        }
                                    </select>
                                </>
                            )}
                        </div>
                        <div>
                            <span style={{'marginRight': '20px'}}>サイズ</span>
                            {   sizes &&
                                sizes.map((size) =>
                                    <label key={size.id} ><input type='checkbox' name='size' onChange={handleFilterCheckbox} value={size.id} checked={params.filter.size.includes(size.id)} />{size.size_name}</label>
                                )
                            }
                        </div>
                        <div style={{'display':'flex'}}>
                            <span style={{'marginRight': '20px'}}>カラー</span>
                            <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                {   colors &&
                                    colors.map((color) =>
                                        <label key={color.id} style={{'display':'block'}}><input type='checkbox' name='color' onChange={handleFilterCheckbox} value={color.id} checked={params.filter.color.includes(color.id)} />{color.color_name}</label>
                                    )
                                }
                            </div>
                        </div>
                        <div style={{'display':'flex'}}>
                            <span style={{'marginRight': '20px'}}>タグ</span>
                            <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                {   tags &&
                                    tags.map((tag) =>
                                        <label key={tag.id} style={{'display':'block'}}><input type='checkbox' name='tag' onChange={handleFilterCheckbox} value={tag.id} checked={params.filter.tag.includes(tag.id)} />{tag.tag_name}</label>
                                    )
                                }
                            </div>
                        </div>
                        <div>
                            <span>期間指定</span>
                            <select name='field' ref={dateRangeField} value={Object.keys(params.filter.dateRange)[0]} onChange={handleFilterDateRange}>
                                <option value={'clear'}>フィールド選択</option>
                                <option value={'posted_at'}>投稿日</option>
                                <option value={'modified_at'}>更新日</option>
                            </select>
                            <input type='number' name='start' ref={dateRangeStart} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][0]: ''} placeholder={'19500101'} />　〜　
                            <input type='number' name='end' ref={dateRangeEnd} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][1]: ''} placeholder={'1980101'} />
                        </div>
                    </div>
                }
                {   Object.keys(params.sort).length > 0 && scope === model &&
                    <div className={'sort'}>
                        <h3>ソート機能</h3>
                        <label>商品名
                            <select name='item_name' value={params.sort.item_name} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>価格
                            <select name='price' value={params.sort.price} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>投稿日
                            <select name='posted_at' value={params.sort.posted_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>更新日
                            <select name='modified_at' value={params.sort.modified_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                    </div>
                }
                {
                    items && !errorMessage &&
                    <ul> 
                        {                        
                            items.map((item) =>
                                <li key={item.id}>
                                    <Link to={`/items/${item.id}`}>
                                        <span><img src={item.top_image} alt="" style={{ 'width':'150px', 'height': '150px', 'display': 'block' }}/></span>
                                        <span style={{'display': 'block'}}>{item.item_name}</span>
                                        <span style={{'display': 'block'}}>{item.included_tax_price_text} (税込)</span>
                                        <span style={{'display': 'block'}}>{item.brand_name}</span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                }
                { data.meta &&
                    <>
                        <label>行数<input type='number' onBlur={handlePerPage} defaultValue={data.meta.per_page} style={{'width': '40px'}} /></label>
                        <div>検索結果{data.meta.total}</div>
                        <div>現在のページ{data.meta.current_page}</div>
                        <Pagination
                            activePage={data.meta.current_page}
                            itemsCountPerPage={data.meta.per_page}
                            totalItemsCount={data.meta.total}
                            pageRangeDisplayed={data.meta.page_range_displayed}
                            onChange={handleCurrentPage}
                        />
                    </>
                }
            </>
        )
    );
}

export default ItemIndexPage;



