import React, {useEffect, useState} from 'react';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {stateFromHTML} from 'draft-js-import-html';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useObjectForm from "../../../hooks/useObjectForm";
import useHelper from "../../../hooks/useHelper";

// TODO ブログ本文で保存された画像をどうするか考える

function BlogEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/blogs/${props.match.params.id}/edit`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, setFormData, handleFormCheckbox, handleFormFile}] = useForm({
        'title': '',
        'body': '',
        'brand_id': '',
        'category_id': '',
        'items_id': [],
        'tags_id': [],
        'is_published': 0, // 0: 非公開 1: 公開中
        'thumbnail': '/img/no_image.png'
    });
    // draft-js用のステート管理
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // 便利関数の呼び出し
    const {isJson} = useHelper();
    // file送信用にフォームのラッパー関数呼び出し
    const {handleSendObjectForm} = useObjectForm(formData, setFormData);
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // API接続の返却値を変数に格納
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
            const contentState = isJson(blog.body) ? convertFromRaw(JSON.parse(blog.body)) : stateFromHTML(blog.body);
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
                    handleSendObjectForm(`/api/admin/blogs/${props.match.params.id}`, dispatch);
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
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.items_id}</p> }
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
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.tags_id}</p> }
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
