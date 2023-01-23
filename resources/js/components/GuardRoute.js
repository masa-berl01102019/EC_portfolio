import React from "react";
import {Redirect, Route} from "react-router-dom";
import {useAuthContext} from "./context/AuthContext";

export function UserPrivateRoute (props) {

    const {isUserLogin} = useAuthContext();

    if(!isUserLogin) {
        return <Redirect to={'/user/login'} />
    } else {
        return <Route {...props} />
    }
}

export function UserLoginRoute (props) {

    const {isUserLogin} = useAuthContext();

    if(isUserLogin) {
        return <Redirect to={'/user/users'} />
    } else {
        return <Route {...props} />
    }
}

export function AdminPrivateRoute (props) {

    const {isAdminLogin} = useAuthContext();

    if(!isAdminLogin) {
        return <Redirect to={'/admin/login'} />
    } else {
        return <Route {...props} />
    }
}

export function AdminLoginRoute (props) {

    const {isAdminLogin} = useAuthContext();

    if(isAdminLogin) {
        return <Redirect to={'/admin/dashboard'} />
    } else {
        return <Route {...props} />
    }
}

