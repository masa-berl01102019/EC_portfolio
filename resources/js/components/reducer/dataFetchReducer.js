import React from "react";

// reducer関数の処理を設定
export const dataFetchReducer = (state, action) => {
    console.log('dataFetchReducerが読み込まれました');
    switch(action.type) {
        case 'CREATE':
            return {
                url: action.url, // POST '/api/admin/users'
                method: 'post',
                data: action.form,
            };
        case 'READ':
            return {
                url: action.url, // GET '/api/admin/users' or '/api/admin/users/create' or '/api/admin/users/{id}' or `/api/admin/users/{id}/edit`
                method: 'get',
            };
        case 'UPDATE':
            return {
                url: action.url, // PUT `/api/admin/users/{id}`
                method: 'put',
                data: action.form,
            };
        case 'DELETE':
            return {
                url:  action.url , // DELETE '/api/admin/users/delete'
                method: 'delete',
                data: action.form,
            };
        default:
            console.log('error');
            return state
    }
};
