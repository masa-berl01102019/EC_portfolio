
const useItemCookies = (cookies, setCookie) => {

    const handleViewItemCookie = (item_id) => {
        // cookieからIDの配列を取得
        const cookie_id_arr = cookies.item_info ? cookies.item_info : [];

        // cookieに保存されてる商品IDと渡ってきたIDが一致しないもしくは空の場合
        if(!cookie_id_arr.includes(item_id) || cookie_id_arr.length == 0) {
            // 配列の先頭に追加
            cookie_id_arr.unshift(item_id);
        } 

        // cookieに保存
        setCookie('item_info', JSON.stringify(cookie_id_arr), { maxAge : 60 * 60 * 24 } );
    }

    return {handleViewItemCookie};
}

export default useItemCookies;
