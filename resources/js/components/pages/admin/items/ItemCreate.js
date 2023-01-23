import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useInputForm from "../../../hooks/useInputForm";

// TODO フロント側でのバリデーション設定
// TODO フォーム部品に関しての関数をリファクタリング時にhooksに切り出す
// TODO 公開設定の表示場所を要検討
// TODO プレビュー機能の実装

function ItemCreate() {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/items/create`;

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
        'is_published': '', // 0: 非公開 1: 公開中
        'brand_id': '',
        'gender_category' : '',
        'main_category' : '',
        'sub_category' : '',
        'tags_id': [],
        'skus': [ {color_id: '', size_id: '', quantity: ''} ],
        'images': [ {image: '', image_category: '', color_id:''} ],
        'measurements': [ {size_id: '', width: '', shoulder_width: '', raglan_sleeve_length: '', sleeve_length: '', length: '', waist: '', hip: '', rise: '', inseam: '', thigh_width: '', outseam: '', sk_length: '', hem_width: '', weight: ''}  ]
    });

    const history = useHistory();

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値 }の形で返却されるので変数に代入しておく
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const main_categories = data.main_categories? data.main_categories: null;
    const sub_categories = data.sub_categories? data.sub_categories: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const tags = data.tags? data.tags: null;

    useEffect(() => {
        // 削除や更新後に再読み込み
        if(data.create && data.create === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/items');
        }
    },[data]);

    const handleFormFile = (e, index) => {
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const recode = formData['images'][index] // 配列のindex番目のオブジェクト取得
        const file = e.target.files[0]; // fileオブジェクトを変数に格納
        const imageUrl = URL.createObjectURL(file); // 新しいオブジェクトURLを生成
        recode[name] = imageUrl; // 配列のindex番目のオブジェクトの特定カラムを更新 *画像プレビューのセット用
        recode['file'] = file; // fileというカラム名を追加してfileオブジェクトを格納
        // ステートを更新
        setFormData({
            ...formData,
            images : [
                ...formData.images,
            ]
        });
    }
    
    // objecy判定便利関数
    function isObject(val) {
        if( val !== null && typeof(val) === 'object' && val.constructor === Object ) {
          return true;
        }
        return false;
    }

    const handleFormSendwithFile = () => {
        // FormDataオブジェクトのインスタンス生成
        const params = new FormData();
        // formオブジェクトを展開
        Object.entries(formData).forEach(([key, value]) => {
            // valueが配列形式か判定
            if(Array.isArray(value)) {
                // 配列を展開
                for(let i = 0; i < value.length; i++) {
                    // 展開した配列内に複数オブジェクトを持つか単純な配列か判定
                    if(isObject(value[i])) {
                        // FormDataは配列やオブジェクトそのままappend()で追加出来ないので formData.images = [ {id:'1', item_id:'2'...} {id:'2', item_id:'3'...}] の場合
                        // 全て展開してkey: valueの形でappend()で代入する際に文字列を下記のように加工すればサーバー側に渡る際にオブジェクトの形式で渡せる
                        Object.entries(value[i]).forEach(([key2, value2]) => {
                            params.append(key+'['+i+']['+key2+']', value2)
                        })
                    } else {
                        // 全て展開してkey[]: valueの形でappend()で代入すればサーバー側に渡る際に配列の形式で渡せる
                        params.append(key+'[]', value[i])
                    }
                }
            } else {
                params.append(key, value);
            }
        });
        // axiosで画像等のファイル形式を送信する際はcontent-typeを'multipart/form-data'にしないと送信出来ない
        // post形式でないと正しく送れない * axiosの仕様的な問題？？
        dispatch({type: 'CREATE', form: params, url: `/api/admin/items`, headers: {'content-type': 'multipart/form-data'} });
    }

    const handleFormOjectRecodes = (e, index, table_name) => {
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const recode = formData[table_name][index] // 配列のindex番目のオブジェクト取得
        recode[name] = e.target.value; // 配列のindex番目のオブジェクトの特定カラムを更新
        // ステートを更新
        setFormData({
            ...formData,
            [table_name] : [
                ...formData[table_name],
            ]
        });
    }

    const handleInsertForm = (target) => {
        let new_obj = {};
        if(formData[target].length > 0) {
            // スプレッド構文でオブジェクトのコピー
            new_obj = {...formData[target][0]}
            // 不要なプロパティを削除
            delete new_obj.created_at;
            delete new_obj.updated_at;
            // オブジェクトを展開して初期化
            for (let key in new_obj) {
                if(key === 'item_id')  continue; // item_idはformにないので残しておく
                new_obj[key] = ''; // 値の初期化
            }
            // ステートを更新して再描画走らせる
            setFormData({
                ...formData,
                [target] : [
                    ...formData[target],
                    new_obj
                ]
            });
        }
    }

    const handleDeleteForm = (id, index, target) => {
        if(formData[target].length > 1) {
            let answer = confirm(`選択項目を削除しますか？`);
            if(answer) {
                // 新規で動的に追加したフォームの場合はＩＤないので条件分岐
                if(id) {
                    // 削除のリクエスト送信
                    dispatch({type:'DELETE', url:`/api/admin/items/delete/${target}`, form:{id: id}});
                } else {
                    // 配列からindex番目のオブジェクトを1個削除
                    formData[target].splice(index,1);
                    // ステートを更新して再描画走らせる
                    setFormData({
                        ...formData
                    });
                }
            }
        } else {
            alert('全ての行は削除出来ません。');
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
                <h1>商品新規登録</h1>
                <div>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        handleFormSendwithFile();
                    }}>
                        <div>
                            <h2>基本情報</h2>
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

                        <div>
                            <h2>カテゴリ</h2>
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

                        <div>
                            <h2>タグ</h2>
                            <div style={{'display':'flex'}}>
                                <span style={{'marginRight': '20px'}}>タグ</span>
                                <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                    {   tags &&
                                        tags.map((tag) =>
                                            <label key={tag.id} style={{'display':'block'}}><input type='checkbox' name='tags_id' onChange={handleFormCheckbox} value={tag.id} checked={formData.tags_id.includes(tag.id)} />{tag.tag_name}</label>
                                        )
                                    }
                                </div>
                                {   errorMessage &&
                                    Object.entries(errorMessage).map((value, index) => {
                                        if(value[0].includes('tags_id')) {
                                            return <p key={index} style={{'color': 'red'}}>{value[1]}</p> 
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div>
                            <h2>SKU</h2>
                            <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                                <thead>
                                    <tr>
                                        <th>削除</th>
                                        <th>サイズ</th>
                                        <th>カラー</th>
                                        <th>在庫数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {   formData.skus &&
                                    formData.skus.map((list, index) =>
                                        <tr key={index}>
                                            <td>
                                                <span 
                                                    onClick={() => {
                                                        if(list.size_id !== '' && formData.measurements.map(item => item.size_id).includes(String(list.size_id))) {
                                                            alert('寸法セクションで選択されたサイズが含まれておりますので削除出来ません。\n先に寸法セクションのサイズを変更してください。');
                                                        } else if(list.color_id !== '' && formData.images.map(item => item.color_id).includes(String(list.color_id))) {
                                                            alert('画像セクションで選択されたカラーが含まれておりますので削除出来ません。\n先に画像セクションのカラーを変更してください。');
                                                        } else {
                                                            handleDeleteForm(list.id, index, 'skus')
                                                        }
                                                    }} 
                                                    style={{'background': 'red', 'color': '#fff', 'padding': '4px 8px'}}
                                                >
                                                    削除
                                                </span>
                                            </td>
                                            <td>
                                                <select name='size_id' value={list.size_id} onChange={ e => handleFormOjectRecodes(e, index, 'skus') }>
                                                    <option value={''}>未設定</option>
                                                    { sizes && sizes.map( size => ( <option key={size.id} value={size.id}>{size.size_name}</option>)) }
                                                </select>
                                            </td>
                                            <td>
                                                <select name='color_id' value={list.color_id} onChange={ e => handleFormOjectRecodes(e, index, 'skus') }>
                                                    <option value={''}>未設定</option>
                                                    { colors && colors.map( color => ( <option key={color.id} value={color.id}>{color.color_name}</option>)) }
                                                </select>
                                            </td>
                                            <td><input type='number' name='quantity' onBlur={ e => handleFormOjectRecodes(e, index, 'skus') } defaultValue={list.quantity} placeholder='数値のみ入力' /></td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                            {   errorMessage &&
                                Object.entries(errorMessage).map((value, index) => {
                                    if(value[0].includes('skus')) {
                                        return <p key={index} style={{'color': 'red'}}>{value[1]}</p> 
                                    }
                                })
                            }
                        </div>
                        <div onClick={() => handleInsertForm('skus')} style={{'width': '30px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'border': '1px solid #000'}}>＋</div>

                        <div>
                            <h2>画像</h2>
                            <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                                <thead>
                                    <tr>
                                        <th>削除</th>
                                        <th>画像</th>
                                        <th>画像種別</th>
                                        <th>関連カラー</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {   formData.images &&
                                    formData.images.map((list, index) =>
                                        <tr key={index}>
                                            <td><span onClick={() => handleDeleteForm(list.id, index, 'images')} style={{'background': 'red', 'color': '#fff', 'padding': '4px 8px'}}>削除</span></td>
                                            <td>
                                                { list.image ? (
                                                    <label className="insert_image">
                                                        <img src={list.image} alt="item image" style={{'width' : '100px', 'height' : '100px'}} />
                                                        <input name="image" type="file" accept="image/*" onChange={ e => handleFormFile(e, index)} style={{'display': 'none'}} />
                                                    </label>
                                                ) : (
                                                    <label  className="insert_image">
                                                        <img src={'/img/no_image.png'} alt="no image" style={{'width' : '100px', 'height' : '100px'}} />
                                                        <input name="image" type="file" accept="image/*" onChange={ e => handleFormFile(e, index)} style={{'display': 'none'}} />
                                                    </label>
                                                )}
                                            </td>
                                            <td>
                                                <select name='image_category' value={list.image_category} onChange={ e => handleFormOjectRecodes(e, index, 'images') }>
                                                    <option value={''}>画像カテゴリを選択</option>
                                                    <option value={0}>メイン画像</option>
                                                    <option value={1}>サムネイル画像</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select name='color_id' value={list.color_id} onChange={ e => handleFormOjectRecodes(e, index, 'images') }>
                                                    <option value={''}>関連カラーを選択</option>
                                                    {   colors && colors.filter((color) => formData.skus.map(item => item.color_id).includes(String(color.id))).map((color) => (
                                                            <option key={color.id} value={color.id}>{color.color_name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                            {   errorMessage &&
                                Object.entries(errorMessage).map((value, index) => {
                                    if(value[0].includes('images')) {
                                        return <p key={index} style={{'color': 'red'}}>{value[1]}</p> 
                                    }
                                })
                            }
                        </div>
                        <div onClick={() => handleInsertForm('images')} style={{'width': '30px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'border': '1px solid #000'}}>＋</div>

                        <div>
                            <h2>寸法</h2>
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
                                            <td><span onClick={() => handleDeleteForm(list.id, index,'measurements')} style={{'background': 'red', 'color': '#fff', 'padding': '4px 8px'}}>削除</span></td>
                                            <td>
                                                <select name='size_id' value={list.size_id} onChange={ e => handleFormOjectRecodes(e, index, 'measurements') }>
                                                    <option value={''}>未設定</option>
                                                    {   sizes && sizes.filter((size) => formData.skus.map(item => item.size_id).includes(String(size.id))).map((size) => (
                                                            <option key={size.id} value={size.id}>{size.size_name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </td>
                                            <td><input type='number' name='width' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.width} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='shoulder_width' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.shoulder_width} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='raglan_sleeve_length' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.raglan_sleeve_length} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='sleeve_length' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.sleeve_length} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='length' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.length} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='waist' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.waist} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='hip' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.hip} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='rise' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.rise} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='inseam' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.inseam} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='thigh_width' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.thigh_width} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='outseam' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.outseam} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='sk_length' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.sk_length} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='hem_width' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.hem_width} placeholder='数値のみ入力' /></td>
                                            <td><input type='number' name='weight' onBlur={ e => handleFormOjectRecodes(e, index, 'measurements') } defaultValue={list.weight} placeholder='数値のみ入力' /></td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                            {   errorMessage && 
                                Object.entries(errorMessage).map((value, index) => {
                                    if(value[0].includes('measurements')) {
                                        return <p key={index} style={{'color': 'red'}}>{value[1]}</p> 
                                    }
                                })
                            }
                        </div>
                        <div onClick={() => handleInsertForm('measurements')} style={{'width': '30px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'border': '1px solid #000'}}>＋</div>

                        <button><Link to={`/admin/items`}>一覧に戻る</Link></button>
                        <button type="submit">新規登録</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default ItemCreate;
