import React, {useEffect, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useInputForm from "../../../hooks/useInputForm";
import axios from "axios";

// TODO フロント側でのバリデーション設定
// TODO 配列やオブジェクト形式でフォーム送信時のバリデーションエラーに対してエラーハンドリングの実装追加
// TODO フォーム部品に関しての関数をリファクタリング時にhooksに切り出す

function ItemEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/items/${props.match.params.id}/edit`;

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useInputForm({
        'product_number': null,
        'item_name': null,
        'price': null,
        'cost': null,
        'made_in': null,
        'mixture_ratio': null,
        'description': null,
        'is_published': '', // 0: 非公開　1: 公開中
        'brand_id': '',
        'gender_category' : '',　// 別テーブル
        'main_category' : '',　// 別テーブル
        'sub_category' : '',　// 別テーブル
        'sizes_id': [], // 別テーブル
        'colors_id': [], // 別テーブル
        'tags_id': [], // 別テーブル
        'images': [], // 別テーブル
        'measurements': [], // 別テーブル
        'skus': [] // 別テーブル
    });

    const history = useHistory();

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値　}の形で返却されるので変数に代入しておく
    const item = data.item;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const main_categories = data.main_categories? data.main_categories: null;
    const sub_categories = data.sub_categories? data.sub_categories: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const tags = data.tags? data.tags: null;

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にitemが入ってこない場合があるので条件分岐してあげる
        if(item) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...item});
        }
        if(data.update === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/items');
        }
    },[data]);



    const handleFormSkus = (e, index) => {
        console.log('handleFormSkus', formData.skus[index], e.target.name);
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const recode = formData.skus[index] // 配列のindex番目のオブジェクト取得
        recode[name] = Number(e.target.value); // 配列のindex番目のオブジェクトの特定カラムを更新

        setFormData({
            ...formData,
            skus : {
                ...formData.skus,
                [index]: recode
            }
        });
    }

    const [fileUrl, setFileUrl] = useState([]);

    const handleFormFile = (e, index) => {
        console.log('handleFormFile', e, index);
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得

        if(name === 'images') {
            // 画像プレビューのセット
            let new_arr = []; // 配列用の変数を宣言
            const file = e.target.files[0]; // fileオブジェクトを変数に格納
            const imageUrl = URL.createObjectURL(file); // 新しいオブジェクトURLを生成
            if(fileUrl.includes(imageUrl)) { // 指定のカラム名の配列に該当の値が既にないか確認
                new_arr = fileUrl.filter(item => item !== imageUrl);
            } else {
                new_arr.push(imageUrl);
            }
            setFileUrl([ ...fileUrl, ...new_arr])
        } else if (name === 'image_category') {
            console.log(e.target.value)
        } else {
            console.log(e.target.value)
        }


        // fileを格納
        // setFormData({
        //     ...formData,
        //     [name]: file
        // });
    }

    const addForm = () => {
        let new_obj = {};
        if(formData.measurements.length > 0) {
            // スプレッド構文でオブジェクトのコピー
            new_obj = {...formData.measurements[0]}
            // オブジェクトを展開して初期化
            for (let key in new_obj) {
                if(key === 'item_id') {
                    continue;　// item_idはformにないので残しておく
                }
                new_obj[key] = ''; // 値の初期化
            }
            // ステートを更新して再描画走らせる
            setFormData({
                ...formData,
                measurements : [
                    ...formData.measurements,
                    new_obj
                ]
            });
        }
    }

    const handleFormMeasurements = (e, index) => {
        console.log('handleFormMeasurements', formData.measurements[index], e.target.name);
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const recode = formData.measurements[index] // 配列のindex番目のオブジェクト取得
        recode[name] = Number(e.target.value); // 配列のindex番目のオブジェクトの特定カラムを更新

        setFormData({
            ...formData,
            measurements : [
                ...formData.measurements,
            ]
        });
    }

    // const deleteRecode = (id, index) => {
    //     let answer = confirm(`選択項目を解除しますか？`);
    //     if(answer) {
    //         if(id) {
    //             dispatch({type:'DELETE', url:`/api/admin/items/delete/measurements`, form:{id: id}});
    //         } else {
    //             formData.measurements.splice(index,1)
    //             setFormData({
    //                 ...formData,
    //                 measurements : [
    //                     ...formData.measurements,
    //                 ]
    //             });
    //         }
    //     }
    // }

    const deleteRecode = (id, index, target) => {
        let answer = confirm(`選択項目を解除しますか？`);
        if(answer) {
            if(id) {
                dispatch({type:'DELETE', url:`/api/admin/items/delete/${target}`, form:{id: id}});
            } else {
                formData[target].splice(index,1)
                setFormData({
                    ...formData
                });
            }
        }
    }

    const handleFormCategory = (e) => {
        console.log('handleFormCategory');

        let new_obj; // obj用の変数を宣言

        // 親カテゴリのIDが変更時には子以下のカテゴリをクリアにするようオブジェクト生成して分割代入
        if(e.target.name === 'gender_category') {
            new_obj = {'gender_category': e.target.value, 'main_category': '', 'sub_category': ''};
        } else if (e.target.name === 'main_category') {
            new_obj = {'main_category': e.target.value, 'sub_category': ''};
        } else {
            new_obj = {'sub_category': e.target.value};
        }

        setFormData({
            ...formData,
            ...new_obj
        });
    }

    const handleFormCheckbox = (e) => {
        console.log('handleFormCheckbox');
        let new_arr; // 配列用の変数を宣言
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const value = Number(e.target.value); // 渡ってきた値を取得

        if(formData[name].includes(value)) { // 指定のカラム名の配列に該当の値が既にないか確認
            new_arr = formData[name].filter(item => item !== value );
        } else {
            new_arr = formData[name];
            new_arr.push(value);
        }

        setFormData({
            ...formData,
            [name]: new_arr
        });
    };

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div style={{'margin': '0 auto'}}>
                <h1>商品編集</h1>
                <div className="tabs">
                    <input id="basic_tab" type='radio' name="tab" style={{'display': 'none'}} defaultChecked={true} />
                    <label className="basic_tab" htmlFor="basic_tab">基本情報</label>
                    <input id="category_tab" type='radio' name="tab" style={{'display': 'none'}} />
                    <label className="category_tab" htmlFor="category_tab">カテゴリ</label>
                    <input id="tag_tab" type='radio' name="tab" style={{'display': 'none'}} />
                    <label className="tag_tab" htmlFor="tag_tab">タグ</label>
                    <input id="sku_tab" type='radio' name="tab" style={{'display': 'none'}} />
                    <label className="sku_tab" htmlFor="sku_tab">SKU</label>
                    <input id="image_tab" type='radio' name="tab" style={{'display': 'none'}} />
                    <label className="image_tab" htmlFor="image_tab">画像</label>
                    <input id="size_tab" type='radio' name="tab" style={{'display': 'none'}} />
                    <label className="size_tab" htmlFor="size_tab">寸法</label>
                    <div className="tab_area basic_form">
                        <form onSubmit={ e => {
                            e.preventDefault();
                            dispatch({type: 'UPDATE', form: formData, url: `/api/admin/items/${props.match.params.id}` });
                        }}>
                            <div>
                                <div>
                                    <label>
                                        <span>品番</span>
                                        <input type='text' name='product_number' onBlur={handleFormData} defaultValue={formData.product_number} placeholder='本文を入力' />
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.product_number}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span>商品名</span>
                                        <input type='text' name='item_name' onBlur={handleFormData} defaultValue={formData.item_name} placeholder='本文を入力' />
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.item_name}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span>価格</span>
                                        <input type='number' name='price' onBlur={handleFormData} defaultValue={formData.price} placeholder='本文を入力' />
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.price}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span>原価</span>
                                        <input type='number' name='cost' onBlur={handleFormData} defaultValue={formData.cost} placeholder='本文を入力' />
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.cost}</p> }
                                </div>
                                <div>
                                    <span>原価率</span><span>{ Math.floor(formData.cost / formData.price * 10000) / 100 }%</span>
                                </div>
                                <div>
                                    <label>
                                        <span>生産国</span>
                                        <input type='text' name='made_in' onBlur={handleFormData} defaultValue={formData.made_in} placeholder='本文を入力' />
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.made_in}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span>混用率</span>
                                        <textarea name='mixture_ratio' onBlur={handleFormData} defaultValue={formData.mixture_ratio} placeholder='本文を入力' style={{'width': '100%', 'height': '100px'}} />
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.mixture_ratio}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span>商品説明</span>
                                        <textarea name='description' onBlur={handleFormData} defaultValue={formData.description} placeholder='本文を入力' style={{'width': '100%', 'height': '100px'}} />
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.description}</p> }
                                </div>
                                <div>
                                    <label>公開設定
                                        <select name='is_published' value={formData.is_published} onChange={handleFormData}>
                                            <option value={0}>非公開</option>
                                            <option value={1}>公開</option>
                                        </select>
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.is_published}</p> }
                                </div>
                            </div>
                            <button><Link to={`/admin/items`}>一覧に戻る</Link></button>
                            <button type="submit">編集</button>
                        </form>
                    </div>
                    <div className="tab_area category_form">
                        <form onSubmit={ e => {
                            e.preventDefault();
                            dispatch({type: 'UPDATE', form: formData, url: `/api/admin/items/${props.match.params.id}/categories` });
                        }}>
                            <div>
                                <div>
                                    <label>
                                        <span style={{'marginRight': '20px'}}>ブランド</span>
                                        <select name='brand_id' value={formData.brand_id} onChange={handleFormData}>
                                            <option value={''}>ブランドカテゴリを選択</option>
                                            { brands && brands.map( brand => ( <option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
                                        </select>
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.brand_id}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span style={{'marginRight': '20px'}}>性別</span>
                                        <select name='gender_category' value={formData.gender_category} onChange={handleFormCategory}>
                                            <option value={''}>性別カテゴリを選択</option>
                                            { gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                                        </select>
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.gender_category}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span style={{'marginRight': '20px'}}>メイン</span>
                                        <select name='main_category' value={formData.main_category} onChange={handleFormCategory}>
                                            <option value={''}>メインカテゴリを選択</option>
                                            {   main_categories && main_categories.filter((category) => Number(formData.gender_category) === category.parent_id).map((category) => (
                                                <option key={category.id} value={category.id}>{category.category_name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.main_category}</p> }
                                </div>
                                <div>
                                    <label>
                                        <span style={{'marginRight': '20px'}}>サブ</span>
                                        <select name='sub_category' value={formData.sub_category} onChange={handleFormCategory}>
                                            <option value={''}>サブカテゴリを選択</option>
                                            {   sub_categories && sub_categories.filter((category) => Number(formData.main_category) === category.parent_id).map((category) => (
                                                <option key={category.id} value={category.id}>{category.category_name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.sub_category}</p> }
                                </div>
                            </div>
                            <button><Link to={`/admin/items`}>一覧に戻る</Link></button>
                            <button type="submit">編集</button>
                        </form>
                    </div>
                    <div className="tab_area tag_form">
                        <form onSubmit={ e => {
                            e.preventDefault();
                            dispatch({type: 'UPDATE', form: formData, url: `/api/admin/items/${props.match.params.id}/tags` });
                        }}>
                            <div>
                                <div style={{'display':'flex'}}>
                                    <span style={{'marginRight': '20px'}}>タグ</span>
                                    <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                        {   tags &&
                                            tags.map((tag) =>
                                                <label key={tag.id} style={{'display':'block'}}><input type='checkbox' name='tags_id' onChange={handleFormCheckbox} value={tag.id} checked={formData.tags_id.includes(tag.id)} />{tag.tag_name}</label>
                                            )
                                        }
                                    </div>
                                    {/*　TODO　要修正　*/}
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage['tags_id.1']}</p> }
                                </div>
                            </div>
                            <button><Link to={`/admin/items`}>一覧に戻る</Link></button>
                            <button type="submit">編集</button>
                        </form>
                    </div>
                    <div className="tab_area sku_form">
                        <form onSubmit={ e => {
                            e.preventDefault();
                            dispatch({type: 'UPDATE', form: formData, url: `/api/admin/items/${props.match.params.id}/skus` });
                        }}>
                            <div>
                                <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                                    <thead>
                                        <tr>
                                            <th>削除</th>
                                            <th>SKU ID</th>
                                            <th>サイズ</th>
                                            <th>カラー</th>
                                            <th>在庫数</th>
                                            <th>作成日</th>
                                            <th>更新日</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {   formData.skus &&
                                        formData.skus.map((list, index) =>
                                            <tr key={index}>
                                                <td><span onClick={() => { deleteRecode(list.id, index, 'skus') }} style={{'background': 'red', 'color': '#fff', 'padding': '4px 8px'}}>削除</span></td>
                                                <td>{list.id}</td>
                                                <td>
                                                    <select name='size_id' value={list.size_id} onChange={ e => handleFormSkus(e, index) }>
                                                        { sizes && sizes.map( size => ( <option key={size.id} value={size.id}>{size.size_name}</option>)) }
                                                    </select>
                                                </td>
                                                <td>
                                                    <select name='color_id' value={list.color_id} onChange={ e => handleFormSkus(e, index) }>
                                                        { colors && colors.map( color => ( <option key={color.id} value={color.id}>{color.color_name}</option>)) }
                                                    </select>
                                                </td>
                                                <td><input type='number' name='quantity' onBlur={ e => handleFormSkus(e, index) } defaultValue={list.quantity} placeholder='数値のみ入力' /></td>
                                                <td>{list.created_at}</td>
                                                <td>{list.updated_at}</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                                {/*　TODO　要修正　*/}
                                {   errorMessage &&
                                    Object.values(errorMessage).map((error, index) => (
                                        <p key={index} style={{'color': 'red'}}>{error}</p>
                                    ))
                                }
                            </div>
                            <div onClick={addForm} style={{'width': '30px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'border': '1px solid #000'}}>＋</div>
                            <button><Link to={`/admin/items`}>一覧に戻る</Link></button>
                            <button type="submit">編集</button>
                        </form>
                    </div>
                    <div className="tab_area image_form">
                        <form onSubmit={ e => {
                            e.preventDefault();
                            dispatch({type: 'UPDATE', form: formData, url: `/api/admin/items/${props.match.params.id}/images` });
                        }}>
                            {/*// TODO errorMessageのセット*/}
                            {/*// TODO handleFormFileのカスタマイズ*/}
                            {/*// TODO カラーの連結*/}
                            <div>
                                <input name="images" type="file" accept="image/*" multiple onChange={handleFormFile} />
                                <ul>
                                    {   item && item.images &&
                                        item.images.map((img) =>
                                            <li key={img.id}><img src={img.image} alt="item image" style={{'width' : '100px', 'height' : '100px'}}/><span>{img.image_category_text}</span><span>連結するカラー</span></li>
                                        )
                                    }
                                </ul>
                                {/*　プレビュー　*/}
                                <ul>
                                    {   fileUrl &&
                                        fileUrl.map((img, index) =>
                                            <li key={index}>
                                                <img src={img} alt="item image" style={{'width' : '100px', 'height' : '100px'}}/>
                                                <select name='image_category' value={formData.tests} onChange={ e => handleFormFile(e, index)}>
                                                    <option value={''}>画像カテゴリを選択</option>
                                                    <option value={0}>メイン画像</option>
                                                    <option value={1}>サムネイル画像</option>
                                                </select>
                                                <select name='color_id' value={formData.tests} onChange={ e => handleFormFile(e, index)}>
                                                    <option value={''}>関連カラーを選択</option>
                                                    {   colors && colors.filter((color) => item.colors_id.includes(color.id)).map((color) => (
                                                            <option key={color.id} value={color.id}>{color.color_name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                            <button><Link to={`/admin/items`}>一覧に戻る</Link></button>
                            <button type="submit">編集</button>
                        </form>
                    </div>
                    <div className="tab_area size_form">
                        <form onSubmit={ e => {
                            e.preventDefault();
                            dispatch({type: 'UPDATE', form: formData, url: `/api/admin/items/${props.match.params.id}/measurements`});
                        }}>
                            <div>
                                <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                                    <thead>
                                    <tr>
                                        <th>削除</th>
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
                                        formData.measurements &&
                                        formData.measurements.map((list, index) =>
                                            <tr key={index}>
                                                <td><span onClick={() => { deleteRecode(list.id, index,'measurements') }} style={{'background': 'red', 'color': '#fff', 'padding': '4px 8px'}}>削除</span></td>
                                                <td>
                                                    <select name='size_id' value={list.size_id} onChange={ e => handleFormMeasurements(e, index) }>
                                                        <option value={''}>未設定</option>
                                                        {   sizes && sizes.filter((size) => item.sizes_id.includes(size.id)).map((size) => (
                                                                <option key={size.id} value={size.id}>{size.size_name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </td>
                                                <td><input type='number' name='width' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.width} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='shoulder_width' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.shoulder_width} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='raglan_sleeve_length' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.raglan_sleeve_length} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='sleeve_length' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.sleeve_length} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='length' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.length} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='waist' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.waist} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='hip' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.hip} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='rise' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.rise} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='inseam' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.inseam} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='thigh_width' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.thigh_width} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='outseam' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.outseam} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='sk_length' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.sk_length} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='hem_width' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.hem_width} placeholder='数値のみ入力' /></td>
                                                <td><input type='number' name='weight' onBlur={ e => handleFormMeasurements(e, index) } defaultValue={list.weight} placeholder='数値のみ入力' /></td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                                {/* TODO error全て拾ってしまうので修正 */}
                                {   errorMessage &&
                                    Object.values(errorMessage).map((error, index) => (
                                        <p key={index} style={{'color': 'red'}}>{error}</p>
                                    ))
                                }
                            </div>
                            <div onClick={addForm} style={{'width': '30px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'border': '1px solid #000'}}>＋</div>
                            <button><Link to={`/admin/items`}>一覧に戻る</Link></button>
                            <button type="submit">編集</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}

export default ItemEdit;
