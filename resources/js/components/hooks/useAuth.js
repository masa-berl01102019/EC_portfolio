import {useQuery, useMutation, useQueryClient} from 'react-query';
import axios from "axios";
import useSetErrorMsg from "./useSetErrorMsg";


const useAuth = (url, auth) => {
    // Get lang which has been used in browser from localStorage or assign default lang
    const locale = {'X-Request-Locale': localStorage.getItem('lang') || 'en'};
    // Call Error handling custom hook
    const [errorMessage, {setErrorMessage, handleApiErrorMessage}] = useSetErrorMsg(null);
    // Get queryClient which is passed by react-query provider in App.js
    // * It can refetch data / get cache / update cache etc to designate key
    const queryClient = useQueryClient();
    // Function to initialize CSRF
    const initialCSRF = (func) => axios({ method: 'get', url: '/sanctum/csrf-cookie' }).then(res => func());

    // Login check
    const {data : {data}} = useQuery(
        [auth, url],
        async () => {
            setErrorMessage(null);
            return await initialCSRF(() => axios({ method: 'get', url: url, headers: locale }));
        },
        { 
            // onSuccess: (res) => console.log('success', res.data),
            onError: (err) =>  handleApiErrorMessage(err)
        }
    );
    // Login method
    const {mutate: handleLogin} = useMutation(
        async ({url, form, headers}) => {
            setErrorMessage(null);
            // console.log('Login', url, form, {...headers, ...locale});
            return await initialCSRF(() => axios({ method: 'post', url: url, data: form, headers: {...headers, ...locale} }));
        },
        { 
            onSuccess: (res, obj) => {
                // console.log('success', res.data)
                // Catch callback function as argument and execute if there is it, after API request is done successfully.
                const {callback} = obj;
                callback !== undefined && callback();
                queryClient.invalidateQueries(auth);
            },
            onError: (err) => handleApiErrorMessage(err),
        }
    );
    // Logout method
    const {mutate: handleLogout} = useMutation(
        async ({url, form, headers}) => {
            setErrorMessage(null);
            // console.log('Logout', url, form, {...headers, ...locale});
            return await initialCSRF(() => axios({ method: 'post', url: url, data: form, headers: {...headers, ...locale} }));
        },
        { 
            onSuccess: (res, obj) => {
                // console.log('success', res.data)
                const {callback} = obj;
                callback !== undefined && callback();
                queryClient.invalidateQueries(auth);
            },
            onError: (err) => handleApiErrorMessage(err),
        }
    );
    // send ResetPasswordEmail method
    const {mutate: handleResetPasswordEmail} = useMutation(
        async ({url, form, headers}) => {
            setErrorMessage(null);
            // console.log('send ResetPasswordEmail', url, form, {...headers, ...locale});
            return await initialCSRF(() => axios({ method: 'post', url: url, data: form, headers: {...headers, ...locale} }));
        },
        { 
            onSuccess: (res, obj) => {
                // console.log('success', res.data)
                const {callback} = obj;
                callback !== undefined && callback();
                queryClient.invalidateQueries(auth);
            },
            onError: (err) => handleApiErrorMessage(err),
        }
    );
    // change Password method
    const {mutate: handleChangePassword} = useMutation(
        async ({url, form, headers}) => {
            setErrorMessage(null);
            // console.log('change Password', url, form, {...headers, ...locale});
            return await initialCSRF(() => axios({ method: 'post', url: url, data: form, headers: {...headers, ...locale} }));
        },
        { 
            onSuccess: (res, obj) => {
                // console.log('success', res.data)
                const {callback} = obj;
                callback !== undefined && callback();
                queryClient.invalidateQueries(auth);
            },
            onError: (err) => handleApiErrorMessage(err),
        }
    );

    return {data, errorMessage, handleLogin, handleLogout, handleResetPasswordEmail, handleChangePassword};
};

export default useAuth;

