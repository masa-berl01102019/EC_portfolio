import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useParamsContext } from '../../../context/ParamsContext';

function BlogIndexPage() {

    // urlの設定
    const baseUrl = `/api/user/blogs`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'BLOG';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleFilterDateRange, handleCurrentPage, handlePerPage, handleSort}] = useCreateParams();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const blogs = data.data? data.data: null;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;
    const items = data.items? data.items: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('BLOGにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'posted_at' : '', 'modified_at' : '' },
                filter: { 'keyword' : '', 'tag' : [], 'brand' : [], 'item' : [], 'gender_category' : [], 'dateRange': {} },
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
                <h1>ブログ一覧</h1>

                {   Object.keys(params.filter).length > 0 && scope === model &&
                    <div className={'filter'}>
                        <h3>フィルター機能</h3>
                        <div>
                            <span>キーワード検索</span>
                            <input type='text' name='keyword' onBlur={handleFilter} defaultValue={params.filter.keyword} placeholder={'タイトルを検索'}/>
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
                            {   gender_categories &&
                                gender_categories.map((gender_category) =>
                                    <label key={gender_category.id} ><input type='checkbox' name='gender_category' onChange={handleFilterCheckbox} value={gender_category.id} checked={params.filter.gender_category.includes(gender_category.id)} />{gender_category.category_name}</label>
                                )
                            }
                        </div>
                        <div style={{'display':'flex'}}>
                            <span style={{'marginRight': '20px'}}>関連品番</span>
                            <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                {   items &&
                                    items.map((item) =>
                                        <label key={item.id} style={{'display':'block'}}><input type='checkbox' name='item' onChange={handleFilterCheckbox} value={item.id} checked={params.filter.item.includes(item.id)} />{item.product_number}</label>
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
                {   blogs && !errorMessage &&
                    blogs.map((blog) =>
                        <Link to={`/blogs/${blog.id}`} key={blog.id}>
                            <div style={{'display': 'flex'}}>
                                <img src={blog.thumbnail} alt="" style={{ 'width':'120px', 'height': '80px', 'display': 'block' }}/>
                                <div>
                                    <p>{blog.title}</p>
                                    <p>{blog.brand_name}</p>
                                    <p>{blog.modified_at ? blog.modified_at : blog.posted_at}</p>
                                </div>
                            </div>
                        </Link>
                    )
                }
                {   data.meta &&
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

export default BlogIndexPage;



