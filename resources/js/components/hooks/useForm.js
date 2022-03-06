import React, {useState} from 'react';

// form関連の関数
const useForm = (initialValue) => {

    const [formData, setFormData] = useState(initialValue);

    const handleFormData = (e) => {
        console.log('handleFormData');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleFormDate = (date, name) => { // Sat Feb 17 2018 14:43:00 GMT+0900 (日本標準時)の形式で値が渡ってくる
        console.log('handleFormDate');
        // date型に合わせてフォーマット
        let formatted_date = date !== null ? date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) : null;
        setFormData({
            ...formData,
            [name]: formatted_date
        });
    };

    const handleFormCheckbox = (e) => {
        console.log('handleFormCheckbox');
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

    const handleFormFile = (e) => {
        console.log('handleFormFile');
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

    const handleFormCategory = (e) => {
        console.log('handleFormCategory');
        let new_obj; // obj用の変数を宣言
        // 親カテゴリのIDが変更時には子以下のカテゴリをクリアにするようオブジェクト生成して分割代入
        if(e.target.name === 'gender_category') {
            new_obj = {'gender_category': e.target.value, 'main_category': '', 'sub_category': ''};
        } else if (e.target.name === 'main_category') {
            new_obj = {'main_category': e.target.value, 'sub_category': ''};
        } else {
            new_obj = {'sub_category': e.target.value};
        }
        setFormData({
            ...formData,
            ...new_obj
        });
    }

    return [formData, {setFormData, handleFormData, handleFormDate, handleFormCheckbox, handleFormFile, handleFormCategory}];
}

export default useForm;
