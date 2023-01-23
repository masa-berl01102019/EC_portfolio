import React, {useEffect, useState} from 'react';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {stateFromHTML} from 'draft-js-import-html';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useInputForm from "../../../hooks/useInputForm";

// TODO フロント側でのバリデーション設定
// TODO ブログ本文で保存された画像をどうするか考える

function BlogEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/blogs/${props.match.params.id}/edit`;

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useInputForm({
        'title': '',
        'body': '',
        'brand_id': '',
        'category_id': '',
        'items_id': [],
        'tags_id': [],
        'is_published': 0, // 0: 非公開 1: 公開中
        'thumbnail': '/img/no_image.png'
    });

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const history = useHistory();

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値 }の形で返却されるので変数に代入しておく
    const blog = data.blog;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;
    const items = data.items? data.items: null;

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にblogが入ってこない場合があるので条件分岐してあげる
        if(blog) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...blog});
            // blogの本文はJSONで保存されてるのでcontentStateに変換 * デモデータはHTMLで保存されてるのでJSONか判定して違ったらHTMLをcontentStateに変換
            const contentState = is_json(blog.body) ? convertFromRaw(JSON.parse(blog.body)) : stateFromHTML(blog.body);
            // contentStateをeditorStateに変換
            const editorState = EditorState.createWithContent(contentState);
            // editorStateをdraft.jsにセット
            setEditorState(editorState);
        }
        if(data.update === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/blogs');
        }
    },[data]);

    // JSON判定用の関数
    const is_json = (data) => {
        try {
            JSON.parse(data);
        } catch (error) {
            return false;
        }
        return true;
    }

    // ItemIndexにも使われてるもののオブジェクトではない番
    const handleFormFile = (e) => {
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const file = e.target.files[0]; // fileオブジェクトを変数に格納
        const imageUrl = URL.createObjectURL(file); // 新しいオブジェクトURLを生成
        // ステートを更新
        setFormData({
            ...formData,
            [name]: imageUrl,
            'file': file
        });
    };

    // objecy判定便利関数 ItemIndexにも使われてるので後で切り出す
    function isObject(val) {
        if( val !== null && typeof(val) === 'object' && val.constructor === Object ) {
            return true;
        }
        return false;
    }

    // ItemIndexにも使われてるので後で切り出す
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
        dispatch({type: 'CREATE', form: params, url:`/api/admin/blogs/${props.match.params.id}`, headers: {'content-type': 'multipart/form-data'}});
    }

    // ItemIndexにも使われてるので後で切り出す
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

    const onEditorStateChange = (editorState) => {
        // 現在のeditorStateからcontentStateを取得 
        const contentState = editorState.getCurrentContent();
        // HTMLに変換して保存すると一部のスタイルが消えてしまうのでcontentStateをJSON形式で保存
        const content = JSON.stringify(convertToRaw(contentState));
        // formDataのbodyに保存
        setFormData({
            ...formData,
            body : content
        });
        // editorStateを更新
        setEditorState(editorState);
    };

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div style={{'width': '50%', 'margin': '0 auto'}}>
                <h1>ブログ編集</h1>
                <form onSubmit={ e => {
                    e.preventDefault();
                    handleFormSendwithFile();
                }}>
                    <div>
                        <label>
                            <span style={{'marginRight': '20px'}}>タイトル</span>
                            <input type='text' name='title' onBlur={handleFormData} defaultValue={formData.title} placeholder='タイトル名'/>
                        </label>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.title}</p> }
                    </div>
                    
                    <div>
                        <div>本文</div>
                        <div style={{ 'border': '1px solid #858585', 'background': '#fff'}}>
                            <Editor
                                editorState={editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={onEditorStateChange}
                            />
                        </div>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.body}</p> }
                    </div>

                    <div>
                        <span>サムネイル</span>
                        <label className="insert_image">
                            <img src={formData.thumbnail} alt="blog image" style={{'width' : '100px', 'height' : '100px'}} />
                            <input name="thumbnail" type="file" accept="image/*" onChange={ e => handleFormFile(e)} style={{'display': 'none'}} />
                        </label>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.file}</p> }
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.thumbnail}</p> }
                    </div>

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
                            <select name='category_id' value={formData.category_id} onChange={handleFormData}>
                                <option value={''}>性別カテゴリを選択</option>
                                { gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                            </select>
                        </label>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.category_id}</p> }
                    </div>

                    <div>
                        <div style={{'display':'flex'}}>
                            <span style={{'marginRight': '20px'}}>関連品番</span>
                            <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                {   items &&
                                    items.map((item) =>
                                        <label key={item.id} style={{'display':'block'}}><input type='checkbox' name='items_id' onChange={handleFormCheckbox} value={item.id} checked={formData.items_id.includes(item.id)} />{item.product_number}</label>
                                    )
                                }
                            </div>
                        </div>
                        {   errorMessage &&
                            Object.entries(errorMessage).map((value, index) => {
                                if(value[0].includes('items_id')) {
                                    return <p key={index} style={{'color': 'red'}}>{value[1]}</p> 
                                }
                            })
                        }
                    </div>

                    <div>
                        <div style={{'display':'flex'}}>
                            <span style={{'marginRight': '20px'}}>タグ</span>
                            <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                {   tags &&
                                    tags.map((tag) =>
                                        <label key={tag.id} style={{'display':'block'}}>
                                            <input type='checkbox' name='tags_id' onChange={handleFormCheckbox} value={tag.id} checked={formData.tags_id.includes(tag.id)} />
                                            {tag.tag_name}
                                        </label>
                                    )
                                }
                            </div>
                        </div>
                        {   errorMessage &&
                            Object.entries(errorMessage).map((value, index) => {
                                if(value[0].includes('tags_id')) {
                                    return <p key={index} style={{'color': 'red'}}>{value[1]}</p> 
                                }
                            })
                        }
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

                    <button><Link to={`/admin/blogs`}>一覧に戻る</Link></button>
                    <button type="submit">編集</button>
                </form>
            </div>
        )
    );
}

export default BlogEdit;
