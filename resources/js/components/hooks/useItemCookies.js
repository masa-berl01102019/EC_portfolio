
const useItemCookies = (cookies, setCookie) => {

    const handleViewItemCookie = (item_id) => {
        // Get ID from cookie
        const cookie_id_arr = cookies.item_info ? cookies.item_info : [];

        // Check whether if item ID which is stored in cookie correspond with ID passed by argument
        if(!cookie_id_arr.includes(item_id) || cookie_id_arr.length == 0) {
            cookie_id_arr.unshift(item_id);
        } 

        // Store ID in cookie
        setCookie('item_info', JSON.stringify(cookie_id_arr), { maxAge : 60 * 60 * 24 } );
    }

    return {handleViewItemCookie};
}

export default useItemCookies;
