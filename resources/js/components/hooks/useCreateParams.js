import {useRecoilState} from 'recoil'
import { paramState } from '../store/paramState'; 

const useCreateParams = (model) => {

    // グローバルで管理するパラメータを取得
    const [params, setParams] = useRecoilState(paramState(model));

    /**
     * 以下ソート関連の関数
    */

    const handleSort = (e) => {
        console.log('handleSort直前のparams', params);
        setParams({
            ...params,
            sort: {
                ...params.sort,
                [e.target.name]: e.target.value
            }
        });
    }

    /**
     * 以下ページネーション関連の関数
    */

    const handleCurrentPage = (pageNumber) => {
        console.log('handleCurrentPage直前のparams', params);
        setParams({
            ...params,
            paginate: {
                ...params.paginate,
                'current_page': pageNumber
            }
        });
    };

    const handlePerPage = (e) => {
        console.log('handlePerPage直前のparams', params);
        setParams({
            ...params,
            paginate: {
                ...params.paginate,
                'per_page': Number(e.target.value)
            }
        });
    };

    /**
     * 以下フィルター関連の関数
    */

    // input text / selectbox / input radio 用
    const handleFilter = (e) => {
        console.log('handleFilter直前のparams', params);
        setParams({
            ...params,
            filter: {
                ...params.filter,
                [e.target.name]: e.target.value
            }
        });
    }

    // input checkbox用
    const handleFilterCheckbox = (e) => {
        console.log('handleFilterCheckbox直前のparams', params);
        let new_arr = []; // 配列用の変数を宣言
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const value = Number(e.target.value); // 渡ってきた値を取得
        if( params.filter[name].includes(value)) { // 指定のカラム名の配列に該当の値が既にないか確認
            new_arr = params.filter[name].filter(item => item !== value );
        } else {
            new_arr = [...params.filter[name]];
            new_arr.push(value);
        }
        setParams({
            ...params,
            filter: {
                ...params.filter,
                [name]: new_arr
            }
        });
    };

    // input checkbox用 clear
    const handleClearFilterCheckbox = (e) => {
        console.log('handleClearFilterCheckbox直前のparams', params);
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        setParams({
            ...params,
            filter: {
                ...params.filter,
                [name]: []
            }
        });
    };

    const handleFilterDate = (date, name) => {
        // date型に合わせてフォーマット  Sat Feb 17 2018 14:43:00 GMT+0900 (日本標準時)の形式で値が渡ってくる
        let formatted_date = date !== null ? date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) : null;

        // onChangeで入力毎に呼び出されるので正しい日時もしくは完全に入力欄を空にした時以外にsetParamsを呼び出さない用に制御
        if(formatted_date != null && formatted_date.match(/\d{4}\-\d{2}\-\d{2}/) != null || date == null) {
            setParams({
                ...params,
                filter : {
                    ...params.filter,
                    [name]: formatted_date
                }
            });
        }
    };

    const handleFilterDateClear = () => {
        setParams({
            ...params,
            filter : {
                ...params.filter,
                target_span : '',
                from : null,
                to : null,
            }
        });
    };
 
    const handleFilterCategory = (e) => {
        console.log('handleFilterCategory直前のparams', params);
        let new_obj; // obj用の変数を宣言
        // 親カテゴリのIDが変更時には子以下のカテゴリをクリアにするようオブジェクト生成して分割代入
        if(e.target.name === 'gender_category') {
            new_obj = {'gender_category': e.target.value, 'main_category': '', 'sub_category': ''};
        } else if (e.target.name === 'main_category') {
            new_obj = {'main_category': e.target.value, 'sub_category': ''};
        } else {
            new_obj = {'sub_category': e.target.value};
        }
        setParams({
            ...params,
            filter: {
                ...params.filter,
                ...new_obj
            }
        });
    }

    return {handleSort, handleCurrentPage, handlePerPage, handleFilter, handleFilterCheckbox, handleClearFilterCheckbox, handleFilterCategory, handleFilterDate, handleFilterDateClear};
}

export default useCreateParams;
