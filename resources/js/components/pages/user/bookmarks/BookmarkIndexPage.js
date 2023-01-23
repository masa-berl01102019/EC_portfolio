import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useParamsContext } from '../../../context/ParamsContext';

function BookmarkIndexPage() {

    // urlの設定
    const baseUrl = `/api/user/bookmarks`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'BOOKMARK';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleFilterDateRange, handleCurrentPage, handlePerPage, handleSort}] = useCreateParams();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const bookmarks = data.data? data.data: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const brands = data.brands? data.brands: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('BOOKMARKにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'price' : '', 'item_name' : '', 'updated_at' : ''},
                filter: { 'keyword' : '', 'brand' : [], 'size' : [], 'color' : [] },
            });
            setScope(model);
        }
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.delete && data.delete === true || data.create && data.create === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: useCreateUrl(baseUrl, params) });
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
                <h1>お気に入り一覧</h1>
                
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
                        <label>登録日
                            <select name='updated_at' value={params.sort.updated_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                    </div>
                }
                {   bookmarks && !errorMessage &&
                    <ul> 
                        {                        
                            bookmarks.map((bookmark) =>
                                <li key={bookmark.id} style={{'display' : 'flex'}}>
                                    <Link to={`/items/${bookmark.item_id}`}>
                                        <img src={bookmark.top_image} alt="" style={{ 'width':'150px', 'height': '150px', 'display': 'block' }}/>
                                        { bookmark.stock_status === 0 && <p style={{'color': 'red'}}>在庫なし</p>}
                                    </Link>
                                    <div>
                                        <p>{bookmark.brand_name}</p>
                                        <p>{bookmark.item_name}</p>
                                        <p>{bookmark.included_tax_price_text} (税込)</p>
                                        <p>{bookmark.color_name} / {bookmark.size_name}</p>
                                        <p>
                                            { 
                                                bookmark.cart_status === 0 ? (
                                                    <button 
                                                        onClick={ () => { dispatch({type:'CREATE', form: {sku_id: `${bookmark.sku_id}`}, url:`/api/user/carts`}); }}
                                                    >
                                                        カートに入れる
                                                    </button>
                                                ) : (
                                                    <button disabled={true}>カートに登録済</button>
                                                )
                                            }
                                            <button onClick={ () => { dispatch({type:'DELETE', url:`/api/user/bookmarks/${bookmark.id}`}); }}>削除</button>
                                        </p>
                                    </div>
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

export default BookmarkIndexPage;



