import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import { useCookies } from 'react-cookie';

function ItemShowPage(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/user/items/${props.match.params.id}`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // cookieを管理
    const [cookies, setCookie] = useCookies();
    // API接続の返却値を変数に格納
    const item = data.item;
    const sizes = data.sizes? data.sizes: null;
    const related_items = data.related_items? data.related_items: null;

    useEffect(() => {
        if(item) {
            if(cookies.item_info) {
                const cookie_info = {
                    'id' : item.id,
                    'brand_name' : item.brand_name,
                    'item_name' : item.item_name,
                    'included_tax_price_text' : item.included_tax_price_text,
                    'top_image' : item.top_image,
                    'url' : window.location.href,
                };
                const id_arr = cookies.item_info.map(list => list.id);
                if(!id_arr.includes(cookie_info.id)) {
                    cookies.item_info.push(cookie_info);
                    setCookie('item_info', JSON.stringify(cookies.item_info) );
                }
            } else {
                const item_arr = [];
                const cookie_info = {
                    'id' : item.id,
                    'brand_name' : item.brand_name,
                    'item_name' : item.item_name,
                    'included_tax_price_text' : item.included_tax_price_text,
                    'top_image' : item.top_image,
                    'url' : window.location.href,
                };
                item_arr.push(cookie_info);
                setCookie('item_info', JSON.stringify(item_arr) );
            }
        }
        // 削除や更新後に再読み込み
        if(data.create && data.create === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: baseUrl });
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
            {   item && 
                <div style={{'width': '50%', 'margin': '0 auto'}}>
                    <img src={item.top_image} alt="blog image" style={{'width' : '100%'}} />
                    <ul>
                        {   item.images &&
                            item.images.map((list, index) =>
                                <li style={{'display': 'inline-block'}} key={index}>
                                    { list.image ? (
                                        <img src={list.image} alt="item image" style={{'width' : '100px', 'height' : '100px'}} />
                                    ) : (
                                        <img src={'/img/no_image.png'} alt="no image" style={{'width' : '100px', 'height' : '100px'}} />
                                    )}
                                </li>
                            )
                        }
                    </ul>
                    <div style={{'margin': '30px auto 0'}}>
                        <div>{item.brand_name}</div>
                        <div>{item.item_name}</div>
                        <div>{item.included_tax_price_text} (税込)</div>
                    </div>
                    <div style={{'margin': '15px auto 0'}}>
                        {/* TODO: SKU から選択するウィンドウを表示必要 */}
                        <button>カートに入れる</button><br/>
                        <button>お気に入りに登録する</button>
                    </div>
                    <div style={{'margin': '15px auto 0'}}>
                        {   item.skus.map( (sku, index) => 
                                <div key={index}>
                                    <img src={sku.img ? sku.img : '/img/no_image.png'} alt="item image" style={{'width' : '100px', 'height' : '100px'}} />
                                    <span>{sku.color_name}</span>
                                    <ul>
                                        { sku.sizes.map((sku_item, i) => 
                                            <li key={i}>
                                                { sizes.filter((size) => size.id == sku_item.size_id).map(el => <span key={el.id}>{el.size_name}</span>)}　
                                                {sku_item.quantity > 0 ? '在庫有り': '在庫無し'}
                                                <button 
                                                    onClick={() => { dispatch({type:'CREATE', form: {sku_id: `${sku_item.id}`}, url:`/api/user/bookmarks`})}}
                                                    disabled={item.bookmark_items.includes(sku_item.id)}
                                                >
                                                    ブックマークに追加
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )
                        }
                        {   item.skus.map( (sku, index) => 
                                <div key={index}>
                                    <img src={sku.img ? sku.img : '/img/no_image.png'} alt="item image" style={{'width' : '100px', 'height' : '100px'}} />
                                    <span>{sku.color_name}</span>
                                    <ul>
                                        { sku.sizes.map((sku_item, i) => 
                                            <li key={i}>
                                                { sizes.filter((size) => size.id == sku_item.size_id).map(el => <span key={el.id}>{el.size_name}</span>)}　
                                                {sku_item.quantity > 0 ? '在庫有り': '在庫無し'}
                                                <button 
                                                    onClick={() => { dispatch({type:'CREATE', form: {sku_id: `${sku_item.id}`}, url:`/api/user/carts`})}}
                                                    disabled={item.cart_items.includes(sku_item.id)}
                                                >
                                                    カートに追加
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                    <div style={{'margin': '15px auto 0'}}>
                        <h2>商品説明</h2>
                        <div>{item.description}</div>
                    </div>
                    <div style={{'margin': '15px auto 0'}}>
                        <h2>サイズ・詳細</h2>
                        <h3 style={{'margin': '15px auto 0'}}>サイズ表</h3>
                        <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap', 'margin': '10px auto 0'}}>
                            <thead>
                                <tr>
                                    <th>サイズ</th>
                                    <th>身幅</th>
                                    <th>肩幅</th>
                                    <th>裄丈</th>
                                    <th>袖丈</th>
                                    <th>着丈</th>
                                    <th>ウエスト</th>
                                    <th>ヒップ</th>
                                    <th>股上</th>
                                    <th>股下</th>
                                    <th>わたり</th>
                                    <th>パンツ総丈</th>
                                    <th>スカート丈</th>
                                    <th>裾幅</th>
                                    <th>重量</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                item.measurements && sizes &&
                                item.measurements.map((list, index) =>
                                    <tr key={index}> 
                                        {
                                            sizes.filter(size => size.id == list.size_id).map(s => (
                                                <td key={s.id}>{s.size_name}</td>
                                            ))
                                        }
                                        <td>{list.width}</td>
                                        <td>{list.shoulder_width}</td>
                                        <td>{list.raglan_sleeve_length}</td>
                                        <td>{list.sleeve_length}</td>
                                        <td>{list.length}</td>
                                        <td>{list.waist}</td>
                                        <td>{list.hip}</td>
                                        <td>{list.rise}</td>
                                        <td>{list.inseam}</td>
                                        <td>{list.thigh_width}</td>
                                        <td>{list.outseam}</td>
                                        <td>{list.sk_length}</td>
                                        <td>{list.hem_width}</td>
                                        <td>{list.weight}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        <h3 style={{'margin': '15px auto 0'}}>商品詳細</h3>
                        <ul style={{'margin': '10px auto 0'}}>
                            <li><span style={{'fontWeight': 'bold'}}>カラー </span><span>{item.color_variation.join(' / ') }</span></li>
                            <li><span style={{'fontWeight': 'bold'}}>サイズ </span><span>{item.size_variation.join(' / ') }</span></li>
                            <li><span style={{'fontWeight': 'bold'}}>性別 </span><span>{item.gender_category}</span></li>
                            <li><span style={{'fontWeight': 'bold'}}>カテゴリ </span><span>{item.main_category + ' > ' + item.sub_category}</span></li>
                            <li><span style={{'fontWeight': 'bold'}}>素材 </span><span>{item.mixture_ratio}</span></li>
                            <li><span style={{'fontWeight': 'bold'}}>生産国 </span><span>{item.made_in}</span></li>
                            <li><span style={{'fontWeight': 'bold'}}>品番 </span><span>{item.product_number}</span></li>
                        </ul>
                    </div>
                    <div style={{'margin': '30px auto 0'}}>
                        <h2>関連ブログ</h2>
                        {   item.publishedBlogs &&
                            item.publishedBlogs.map((blog) =>
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
                    </div>
                    <div style={{'margin': '30px auto 0'}}>
                        <h2>関連商品</h2>
                        {
                            related_items && !errorMessage &&
                            <ul> 
                                {                        
                                    related_items.map((item) =>
                                        <li key={item.id}>
                                             {/* TODO URLの変更を検知出来ない為dispatchを使ってる点を修正 */}
                                            <Link to={`/items/${item.id}`} onClick={() => { dispatch({ type: 'READ', url: `/api/user/items/${item.id}` }); }}>
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
                    </div>
                    <div style={{'margin': '30px auto 0'}}>
                        <h2>チェックした商品</h2>
                        <div style={{'display': 'flex'}}>
                        {/* TODO URLの変更を検知出来ない為dispatchを使ってる点を修正 */}
                        { cookies.item_info&&
                            cookies.item_info.map(list => (
                                <Link to={`/items/${list.id}`} key={list.id} onClick={() => { dispatch({ type: 'READ', url: `/api/user/items/${list.id}` }); }}>
                                    <img src={list.top_image} alt="" style={{ 'width':'100px', 'height': '100px', 'display': 'block' }}/>
                                </Link>
                            ))
                        }
                        </div>
                    </div>
                    <Link to={`/items`}>一覧に戻る</Link>
                </div>
            }
            </>
        )
    );
}

export default ItemShowPage;
