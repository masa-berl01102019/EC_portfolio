import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";

function TagIndex() {

    // urlの設定
    const baseUrl = `/api/admin/tags`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const tags = data.tags? data.tags: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'tag_name': ''});
    // 選択されたタグのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editTag, setEditTag] = useState(null);

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
                <h1>タグマスタ</h1>
                { errorMessage && <p style={{'color': 'red'}}>{errorMessage.tag_name}</p> }
                <br />
                <div style={{'width': '50%'}}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'CREATE', form: formData, url:'/api/admin/tags'});
                    }}>
                        <input type='text' name='tag_name' onBlur={handleFormData} defaultValue={formData.tag_name} placeholder='タグ名'/>
                        <button type="submit">タグ追加</button>
                    </form>
                </div>
                <br/>
                <div style={{'display': 'flex', 'justifyContent': 'flexStart', 'flexWrap': 'wrap', 'justifyContent': 'spaceBetween'}}>
                    { tags &&
                        tags.map((tag) =>
                            <div key={tag.id} style={{'width': '300px'}}>
                                { tag.id === editableForm ? (
                                    <div style={{'display': 'flex'}}>
                                        <input type="text" name="tag_name" onChange={e => setEditTag(e.target.value)} defaultValue={tag.tag_name} placeholder='タグ名' style={{'width': '60%'}}/>
                                        <button onClick={() => { dispatch({type:'UPDATE', form: {tag_name: `${editTag}`},  url:`/api/admin/tags/${tag.id}`});}}>編集</button>
                                        <button onClick={ () => {
                                            let answer = confirm(`選択タグを本当に削除しますか？`);
                                            answer && dispatch({type:'DELETE', url:`/api/admin/tags/${tag.id}`});
                                        }}>削除</button>
                                    </div>
                                    ) : (
                                    <div style={{'color' : 'skyblue'}} onClick={() => {
                                        setEditTag(tag.tag_name);
                                        setEeditableForm(tag.id);
                                    }}>{tag.tag_name}</div>
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

export default TagIndex;



