import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";

function SizeIndex() {

    // urlの設定
    const baseUrl = `/api/admin/sizes`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const sizes = data.sizes? data.sizes: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'size_name': ''});
    // 選択されたサイズのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editSize, setEditSize] = useState(null);

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
                <h1>サイズマスタ</h1>
                { errorMessage && <p style={{'color': 'red'}}>{errorMessage.size_name}</p> }
                <br />
                <div style={{'width': '50%'}}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'CREATE', form: formData, url:'/api/admin/sizes'});
                    }}>
                        <input type='text' name='size_name' onBlur={handleFormData} defaultValue={formData.size_name} placeholder='サイズ名'/>
                        <button type="submit">サイズ追加</button>
                    </form>
                </div>
                <br/>
                <div style={{'display': 'flex', 'justifyContent': 'flexStart', 'flexWrap': 'wrap', 'justifyContent': 'spaceBetween'}}>
                    { sizes &&
                        sizes.map((size) =>
                            <div key={size.id} style={{'width': '300px'}}>
                                { size.id === editableForm ? (
                                    <div style={{'display': 'flex'}}>
                                        <input type="text" name="size_name" onChange={e => setEditSize(e.target.value)} defaultValue={size.size_name} placeholder='サイズ名' style={{'width': '60%'}}/>
                                        <button onClick={() => { dispatch({type:'UPDATE', form: {size_name: `${editSize}`},  url:`/api/admin/sizes/${size.id}`});}}>編集</button>
                                        <button onClick={ () => {
                                            let answer = confirm(`選択サイズを本当に削除しますか？`);
                                            answer && dispatch({type:'DELETE', url:`/api/admin/sizes/${size.id}`});
                                        }}>削除</button>
                                    </div>
                                    ) : (
                                    <div style={{'color' : 'skyblue'}} onClick={() => {
                                        setEditSize(size.size_name);
                                        setEeditableForm(size.id);
                                    }}>{size.size_name}</div>
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

export default SizeIndex;



