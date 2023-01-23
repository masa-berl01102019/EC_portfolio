import React, {useCallback, useState} from 'react';

const useInputCheckBox = (initialValue = []) => {

    // 一括操作用にIDを配列で管理
    const [checklist, setChecklist] = useState(initialValue);

    // ステートの更新関数
    const handleCheck = useCallback((e) => {
        console.log('handleCheck');
        // APIから渡ってくるデータは数値型だが、e.target.valueで値を取得する際はstringに型変換されて渡ってくるので数値型にキャストする
        const value = Number(e.target.value);
        // include()でcheckedされたIDがステートに含まれてるか判断 * include()の戻り値は常にtrue or false
        if(checklist.includes(value)) {
            // 既に含まれてる場合はcheckedを外したいのでfilter関数で該当IDは含まれない配列を生成してstateを更新
            setChecklist(checklist.filter(item => item !== value ));
        } else {
            // 含まれてない場合は分割代入後に配列に追加
            setChecklist([...checklist, value] );
        }
    }, [checklist]);

    // ステートの初期化関数
    const handleUnCheckAll = useCallback(() => {
        console.log('handleUnCheckAll');
        setChecklist([])
    }, []);

    // ステートの一括更新関数
    const handleCheckAll = useCallback((multiArr) => {
        console.log('handleCheckAll');
        // 配列の初期化
        const arr = [];
        // 配列の有無を確認
        if(multiArr.length > 0) {
            // APIから取得したデータはusersに格納されてるのでfor文で展開
            for(let i = 0; i < multiArr.length; i++ ) {
                // 取得した各ユーザーのIDがステートに含まれていないかチェックしてtrueの時にarrに代入していく
                if(!checklist.includes(multiArr[i].id)) {
                    arr.push(multiArr[i].id);
                }
            }
            // arrに含まれてるIDを分割代入で展開してステートを更新することで再描画が走るのでcheckboxがチェックされた状態で再描画される
            setChecklist([...checklist, ...arr] );
        }
    },[]);

    return [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}];
};

export default useInputCheckBox;
