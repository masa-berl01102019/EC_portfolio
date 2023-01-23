import React from "react";
import {Redirect, Route} from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { authAdminState, authUserState } from "./store/authState";

export function UserPrivateRoute (props) {

    const isUserLogin = useRecoilValue(authUserState);

    if(!isUserLogin) {
        return <Redirect to={'/user/login'} />
    } else {
        return <Route {...props} />
    }
}

export function UserLoginRoute (props) {

    const isUserLogin = useRecoilValue(authUserState);

    // Redirect to previous access URL
    if(isUserLogin) {
        return <Redirect to={props.prevUrl == '/user/login' ? '/' : props.prevUrl} />
    } else {
        return <Route {...props} />
    }
}

export function AdminPrivateRoute (props) {

    const isAdminLogin = useRecoilValue(authAdminState);

    if(!isAdminLogin) {
        return <Redirect to={'/admin/login'} />
    } else {
        return <Route {...props} />
    }
}

export function AdminLoginRoute (props) {

    const isAdminLogin = useRecoilValue(authAdminState);

    if(isAdminLogin) {
        // Redirect to previous access URL
        return <Redirect to={props.prevUrl == '/admin/login' ? '/admin/Dashboard' : props.prevUrl} />
    } else {
        return <Route {...props} />
    }
}

