import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";

function ColorIndex() {

    // urlの設定
    const baseUrl = `/api/admin/colors`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const colors = data.colors? data.colors: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'color_name': ''});
    // 選択されたカラーのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editColor, setEditColor] = useState(null);

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
                <h1>カラーマスタ</h1>
                { errorMessage && <p style={{'color': 'red'}}>{errorMessage.color_name}</p> }
                <br />
                <div style={{'width': '50%'}}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'CREATE', form: formData, url:'/api/admin/colors'});
                    }}>
                        <input type='text' name='color_name' onBlur={handleFormData} defaultValue={formData.color_name} placeholder='カラー名'/>
                        <button type="submit">カラー追加</button>
                    </form>
                </div>
                <br/>
                <div style={{'display': 'flex', 'justifyContent': 'flexStart', 'flexWrap': 'wrap', 'justifyContent': 'spaceBetween'}}>
                    { colors &&
                        colors.map((color) =>
                            <div key={color.id} style={{'width': '300px'}}>
                                { color.id === editableForm ? (
                                    <div style={{'display': 'flex'}}>
                                        <input type="text" name="color_name" onChange={e => setEditColor(e.target.value)} defaultValue={color.color_name} placeholder='カラー名' style={{'width': '60%'}}/>
                                        <button onClick={() => { dispatch({type:'UPDATE', form: {color_name: `${editColor}`},  url:`/api/admin/colors/${color.id}`});}}>編集</button>
                                        <button onClick={ () => {
                                            let answer = confirm(`選択カラーを本当に削除しますか？`);
                                            answer && dispatch({type:'DELETE', url:`/api/admin/colors/${color.id}`});
                                        }}>削除</button>
                                    </div>
                                    ) : (
                                    <div style={{'color' : 'skyblue'}} onClick={() => {
                                        setEditColor(color.color_name);
                                        setEeditableForm(color.id);
                                    }}>{color.color_name}</div>
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

export default ColorIndex;



