import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";

function BrandIndex() {

    // urlの設定
    const baseUrl = `/api/admin/brands`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const brands = data.brands? data.brands: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'brand_name': ''});
    // 選択されたブランドのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editBrand, setEditBrand] = useState(null);

    useEffect(() => {
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.update === true || data.create === true || data.delete === true) {
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
                                            answer && dispatch({type:'DELETE',  url:`/api/admin/brands/${brand.id}`});
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



