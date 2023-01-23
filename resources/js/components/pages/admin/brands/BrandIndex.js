import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useParamsContext } from '../../../context/ParamsContext';
import useInputForm from "../../../hooks/useInputForm";

// TODO 期間指定のフィルター機能を修正(カレンダーで選択する / パラメータがセットされてる時にクリアボタンを表示する)
// 注意事項 API通信で取得したデータもform部品から値を取得する時は文字列で渡ってくるのでデータ型をキャストしないと想定外の挙動になるので注意する　＊typesScriptの導入要検討

function BrandIndex() {

    // urlの設定
    const baseUrl = `/api/admin/brands`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'BRAND';
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const brands = data.brands? data.brands: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useInputForm({'brand_name': ''});
    // 選択されたブランドのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editBrand, setEditBrand] = useState(null);

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('BRANDにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: {},
                filter: {},
            });
            setScope(model);
        }
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.update === true || data.create === true || data.delete === true) {
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
                <h1>ブランドマスタ</h1>
                { errorMessage && <p style={{'color': 'red'}}>{errorMessage.brand_name}</p> }
                <br />
                <div style={{'width': '50%'}}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'CREATE', form: formData, url:'/api/admin/brands'});
                    }}>
                        <input type='text' name='brand_name' onBlur={handleFormData} defaultValue={formData.brand_name} placeholder='ブランド名'/>
                        <button type="submit">ブランド追加</button>
                    </form>
                </div>
                <br/>
                <div style={{'display': 'flex', 'justifyContent': 'flexStart', 'flexWrap': 'wrap', 'justifyContent': 'spaceBetween'}}>
                    { brands &&
                        brands.map((brand) =>
                            <div key={brand.id} style={{'width': '300px'}}>
                                { brand.id === editableForm ? (
                                    <div style={{'display': 'flex'}}>
                                        <input type="text" name="brand_name" onChange={e => setEditBrand(e.target.value)} defaultValue={brand.brand_name} placeholder='ブランド名' style={{'width': '60%'}}/>
                                        <button onClick={() => { dispatch({type:'UPDATE', form: {brand_name: `${editBrand}`},  url:`/api/admin/brands/${brand.id}`});}}>編集</button>
                                        <button onClick={ () => {
                                            let answer = confirm(`選択ブランドを本当に削除しますか？`);
                                            answer && dispatch({type:'DELETE', form: {id: `${brand.id}`},  url:`/api/admin/brands/delete`});
                                        }}>削除</button>
                                    </div>
                                    ) : (
                                    <div style={{'color' : 'skyblue'}} onClick={() => {
                                        setEditBrand(brand.brand_name);
                                        setEeditableForm(brand.id);
                                    }}>{brand.brand_name}</div>
                                  )
                                }
                            </div>
                        )
                    }
                </div>
            </>
        )
    );
}

export default BrandIndex;



