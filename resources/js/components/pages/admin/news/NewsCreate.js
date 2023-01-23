import React, {useEffect, useState} from 'react';
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useObjectForm from "../../../hooks/useObjectForm";

function NewsCreate() {

    // urlの設定
    const baseUrl = '/api/admin/news/create';
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, setFormData, handleFormCheckbox, handleFormFile}] = useForm({
        'title': '',
        'body': '',
        'brand_id': '',
        'category_id': '',
        'tags_id': [],
        'is_published': 0, // 0: 非公開 1: 公開中
        'thumbnail': '/img/no_image.png'
    });
    // draft-js用のステート管理
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // file送信用にフォームのラッパー関数呼び出し
    const {handleSendObjectForm} = useObjectForm(formData, setFormData, dispatch);
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // API接続の返却値を変数に格納
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;

    useEffect(() => {
        if(data.create === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/news');
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

    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div style={{'width': '50%', 'margin': '0 auto'}}>
                <h1>ニュース新規登録</h1>
                <form onSubmit={ e => {
                    e.preventDefault();
                    handleSendObjectForm('/api/admin/news');
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
                            <img src={formData.thumbnail} alt="news image" style={{'width' : '100px', 'height' : '100px'}} />
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

                    <button><Link to={`/admin/news`}>一覧に戻る</Link></button>
                    <button type="submit">新規登録</button>
                </form>
            </div>
        )
    );
}

export default NewsCreate;
