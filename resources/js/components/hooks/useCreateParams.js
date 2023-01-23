import React, {useRef} from 'react';
import { useParamsContext } from '../context/ParamsContext';

const useCreateParams = () => {

    // useContextでグローバルで管理するパラメータを取得
    const {params, setParams} = useParamsContext();
    // 期間指定するフィルターの制御するためのuseRefの呼び出し
    const dateRangeField = useRef(null);
    const dateRangeStart = useRef(null);
    const dateRangeEnd = useRef(null);

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
        let new_arr; // 配列用の変数を宣言
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const value = Number(e.target.value); // 渡ってきた値を取得
        if( params.filter[name].includes(value)) { // 指定のカラム名の配列に該当の値が既にないか確認
            new_arr = params.filter[name].filter(item => item !== value );
        } else {
            new_arr = params.filter[name];
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

    // dateRange用
    const handleFilterDateRange = () => {
        console.log('handleFilterDateRange直前のparams', params);
        // paramsを更新するとAPIをとばす仕様にしてるので、期間指定したいカラム名と開始日と終了日の３つの項目が入力されたかチェックするためにuseRefで値を取得する
        const field = dateRangeField.current.value;
        const startDate = dateRangeStart.current.value;
        const endDate = dateRangeEnd.current.value;

        if(startDate.length !== 8 || endDate.length !== 8) { // TODO フロントのバリデーション周りを実装する際にエラーを出すように修正する
            return false
        }

        if(field !== 'clear' && startDate !== '' && endDate !== '') {
            // 検索開始日と終了日を配列に格納
            let dateRange = [startDate, endDate];
            setParams({
                ...params,
                filter: {
                    ...params.filter,
                    dateRange: {
                        [field]: dateRange
                    }
                }
            });
        } else if(field === 'clear' && startDate !== '' && endDate !== '') {
            // 一度日程の範囲指定した状態で元の戻す場合、「フィールドを選択」を選択した場合にdateRangeに空のオブジェクトを代入してリセットする
            setParams({
                ...params,
                filter: {
                    ...params.filter,
                    dateRange: {}
                }
            });
        }
    }
 
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

    return [ dateRangeStart, dateRangeEnd, dateRangeField, {handleSort, handleCurrentPage, handlePerPage, handleFilter, handleFilterCheckbox, handleClearFilterCheckbox, handleFilterDateRange, handleFilterCategory}];
}

export default useCreateParams;
