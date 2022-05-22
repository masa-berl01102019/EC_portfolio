import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../hooks/useFetchApiData";
import useCreateParams from "../../hooks/useCreateParams";
import { useParamsContext } from '../../context/ParamsContext';
import { useCookies } from 'react-cookie';

function TopPage() {

    // urlの設定
    const baseUrl = `/api/user/home`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'HOME';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleClearFilterCheckbox, handleFilterDateRange, handleCurrentPage, handlePerPage, handleSort}] = useCreateParams();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // cookieを管理
    const [cookies, setCookie] = useCookies();
    // APIから取得したデータを変数に格納
    const items = data.data? data.data: null;
    const blogs = data.blogs? data.blogs: null;
    const news = data.news? data.news: null;
    const notifications = data.notifications? data.notifications: null;
    const ranked_items = data.ranked_items? data.ranked_items: null;
    const recommend_items = data.recommend_items? data.recommend_items: null;
    // const brands = data.brands? data.brands: null;
    // const gender_categories = data.gender_categories? data.gender_categories: null;
    // const main_categories = data.main_categories? data.main_categories: null;
    // const sub_categories = data.sub_categories? data.sub_categories: null;
    // const sizes = data.sizes? data.sizes: null;
    // const colors = data.colors? data.colors: null;
    // const tags = data.tags? data.tags: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('USERにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'last_name_kana' : '', 'birthday' : '', 'created_at' : '', 'updated_at' : ''},
                filter: { 'keyword' : '', 'gender_category' : '', },
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
                <h1>ログイン前 TOP PAGE</h1>
                {   Object.keys(params.filter).length > 0 && scope === model &&
                    <div className={'filter'}>
                        <div>
                            <label><input type='radio' name='gender_category' onChange={handleFilter} value={''} checked={params.filter.gender_category == ''} />ALL</label>
                            <label><input type='radio' name='gender_category' onChange={handleFilter} value={1} checked={params.filter.gender_category.includes(1)} />Men's</label>
                            <label><input type='radio' name='gender_category' onChange={handleFilter} value={2} checked={params.filter.gender_category.includes(2)} />Ladies</label>
                        </div>
                    </div>
                }
                
                <h2 style={{'margin': '30px auto 0'}}>お知らせ一覧</h2>
                {
                    notifications && !errorMessage &&
                    <ul> 
                        {                        
                            notifications.map((notification) =>
                                <li key={notification.id}>
                                    <Link to={`/`}>
                                        <span>{notification.title}</span>
                                        <span>{notification.modified_at ? notification.modified_at : notification.posted_at}</span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                }
                                
                <h2 style={{'margin': '30px auto 0'}}>新着一覧</h2>
                {
                    items && !errorMessage &&
                    <ul style={{'display': 'flex', 'flexFlow': 'wrap'}}> 
                        {                        
                            items.map((item) =>
                                <li key={item.id}>
                                    <Link to={`/items/${item.id}`} style={{'display': 'block', 'width': '150px', 'overflow': 'hidden'}}>
                                        <span><img src={item.top_image} alt="" style={{ 'width':'150px', 'height': '150px' }}/></span><br/>
                                        <span>{item.item_name}</span><br/>
                                        <span>{item.included_tax_price_text} (税込)</span><br/>
                                        <span>{item.brand_name}</span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                }

                <h2 style={{'margin': '30px auto 0'}}>おすすめ一覧</h2>
                {
                    recommend_items && !errorMessage &&
                    <ul style={{'display': 'flex', 'flexFlow': 'wrap'}}> 
                        {                        
                            recommend_items.map((item) =>
                                <li key={item.id}>
                                    <Link to={`/items/${item.id}`} style={{'display': 'block', 'width': '150px', 'overflow': 'hidden'}}>
                                        <span><img src={item.top_image} alt="" style={{ 'width':'150px', 'height': '150px' }}/></span><br/>
                                        <span>{item.item_name}</span><br/>
                                        <span>{item.included_tax_price_text} (税込)</span><br/>
                                        <span>{item.brand_name}</span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                }

                <h2 style={{'margin': '30px auto 0'}}>ランキング一覧</h2>
                {
                    ranked_items && !errorMessage &&
                    <ul style={{'display': 'flex', 'flexFlow': 'wrap'}}> 
                        {                        
                            ranked_items.map((item) =>
                                <li key={item.id}>
                                    <Link to={`/items/${item.id}`} style={{'display': 'block', 'width': '150px', 'overflow': 'hidden'}}>
                                        <span><img src={item.top_image} alt="" style={{ 'width':'150px', 'height': '150px' }}/></span><br/>
                                        <span>{item.item_name}</span><br/>
                                        <span>{item.included_tax_price_text} (税込)</span><br/>
                                        <span>{item.brand_name}</span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                }

                <h2 style={{'margin': '30px auto 0'}}>ニュース一覧</h2>
                {
                    news && !errorMessage &&
                    <ul style={{'display': 'flex', 'flexFlow': 'wrap'}}> 
                        {                        
                            news.map((item) =>
                                <li key={item.id}>
                                    <Link to={`/news/${item.id}`}>
                                        <span><img src={item.thumbnail} alt="" style={{ 'width':'75px', 'height': '50px', 'display': 'block' }}/></span>
                                        <span style={{ 'display':'block', 'width': '150px' }}>{item.title}</span>
                                        <span style={{'display': 'block'}}>{item.brand_name}</span>
                                        <span  style={{'display': 'block'}}>{item.modified_at ? item.modified_at : item.posted_at}</span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                }
            
                <h2 style={{'margin': '30px auto 0'}}>ブログ一覧</h2>
                {
                    blogs && !errorMessage &&
                    <ul style={{'display': 'flex', 'flexFlow': 'wrap'}}> 
                        {                        
                            blogs.map((blog) =>
                            <li key={blog.id}>
                                <Link to={`/blogs/${blog.id}`}>
                                    <span><img src={blog.thumbnail} alt="" style={{ 'width':'75px', 'height': '50px', 'display': 'block' }}/></span>
                                    <span style={{ 'display':'block', 'width': '150px' }}>{blog.title}</span>
                                    <span style={{'display': 'block'}}>{blog.brand_name}</span>
                                    <span style={{'display': 'block'}}>{blog.modified_at ? blog.modified_at : blog.posted_at}</span>
                                </Link>
                            </li>
                            )
                        }
                    </ul>
                }

                <div style={{'margin': '30px auto 0'}}>
                    <h2>チェックした商品</h2>
                    <div style={{'display': 'flex'}}>
                    { cookies.item_info&&
                        cookies.item_info.map(list => (
                            <Link to={`/items/${list.id}`} key={list.id}>
                                <img src={list.top_image} alt="" style={{ 'width':'100px', 'height': '100px', 'display': 'block' }}/>
                            </Link>
                        ))
                    }
                    </div>
                </div>

            </>
        )
    );
}

export default TopPage;