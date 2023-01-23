import React, {useEffect, useState, Suspense, lazy} from 'react';
import axios from "axios";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {CircularProgress} from "@material-ui/core";
import {useAuthContext} from './context/AuthContext';
import {UserPrivateRoute, UserLoginRoute,AdminPrivateRoute, AdminLoginRoute} from './GuardRoute';

// 固定ルーティング
import AdminHeader from "./AdminHeader" ;
import UserHeader from "./UserHeader";
import Footer from './Footer' ;
// user用 各ページコンポーネント
const Top = lazy(() => import( "./pages/user/Top" ));
const UserLogin = lazy(() => import( "./pages/user/auth/UserLogin" ));
// マルチ認証Test用 コンポーネント
const TestUserIndex = lazy(() => import( "./pages/user/users/TestUserIndex" ));
// admin用 各ページコンポーネント
const AdminLogin = lazy(() => import( "./pages/admin/auth/AdminLogin" ));
const Dashboard = lazy(() => import( './pages/admin/dashboard/Dashboard' ));
const UserIndex = lazy(() => import( './pages/admin/users/UserIndex' ));
const UserEdit = lazy(() => import( "./pages/admin/users/UserEdit" ));
const UserCreate = lazy(() => import( "./pages/admin/users/UserCreate" ));
const AdminIndex = lazy(() => import( './pages/admin/admins/AdminIndex' ));
const AdminEdit = lazy(() => import( "./pages/admin/admins/AdminEdit" ));
const AdminCreate = lazy(() => import( "./pages/admin/admins/AdminCreate" ));
const NotificationIndex = lazy(() => import( "./pages/admin/notifications/NotificationIndex" ));
const NotificationCreate = lazy(() => import( "./pages/admin/notifications/NotificationCreate" ));
const NotificationEdit = lazy(() => import( "./pages/admin/notifications/NotificationEdit" ));
const ContactIndex = lazy(() => import( "./pages/admin/contacts/ContactIndex" ));
const ContactEdit = lazy(() => import( "./pages/admin/contacts/ContactEdit" ));
const ItemIndex = lazy(() => import( "./pages/admin/items/ItemIndex" ));
const ItemCreate = lazy(() => import( "./pages/admin/items/ItemCreate" ));
const ItemEdit = lazy(() => import( "./pages/admin/items/ItemEdit" ));
const BlogIndex = lazy(() => import( "./pages/admin/blogs/BlogIndex" ));
const BlogCreate = lazy(() => import( "./pages/admin/blogs/BlogCreate" ));
const BlogEdit = lazy(() => import( "./pages/admin/blogs/BlogEdit" ));
const NewsIndex = lazy(() => import( "./pages/admin/news/NewsIndex" ));
const NewsCreate = lazy(() => import( "./pages/admin/news/NewsCreate" ));
const NewsEdit = lazy(() => import( "./pages/admin/news/NewsEdit" ));
const OrderIndex = lazy(() => import( "./pages/admin/orders/OrderIndex" ));
const OrderEdit = lazy(() => import( "./pages/admin/orders/OrderEdit" ));
// エラーページ用 コンポーネント
const NotFound = lazy(() => import( "./pages/error/NotFound" ));



function Router() {

    // Auth Contextの呼び出し
    const {isUserLogin, setIsUserLogin, isAdminLogin, setIsAdminLogin} = useAuthContext();
    // ログイン者の名前を管理
    const [authName, setAuthName] = useState('');
    // ブラウザからのアクセスされたURLのドメイン以下を取得して文字列を切り出す
    const str = window.location.pathname.substr( 1, 5 );
    // Auth名の設定 ＊ 今回のアプリでは管理画面のURLは全て /admin/* のルーティングになるので取得した文字列がadminかどうかで管理者ページへのアクセスか一般ページへのアクセスか判別してauth名を決定
    const auth = str !== 'admin' ? 'user': 'admin';
    // axiosの処理が終わったかどうかをフラグ管理
    const [isResolve, setIsResolve] = useState(false);

    useEffect(() => {
        // ログインしているかどうかをAPIにアクセスして調べる
        axios.get(`/api/${auth}/auth`).then(res => {
            // ログインしていればサーバーからログイン者名が返ってくるのでそこで条件分岐
            if(res.data) {
                // userページへのアクセスがありかつユーザーがログイン済みの場合はユーザーのログインステータスをTRUEにセットする
                if(auth === 'user') {
                    setIsUserLogin(true);
                } else {
                    setIsAdminLogin(true);
                }
                // 名前をセット
                setAuthName(res.data);
            }
        }).catch( error => {
            console.log(error);
        }).finally(() => {
            setIsResolve(true);
        });
        // userとadminのステータスに変更があるたびにuseEffectを呼び出す * リロード後もログイン状況を保持する為
    }, [isUserLogin, isAdminLogin]);

    return (
        <BrowserRouter>
            { auth === 'user' ? <UserHeader authName={authName} /> : <AdminHeader authName={authName} />}
            { isResolve &&
                <main>
                    <Suspense fallback={<CircularProgress disableShrink />}>
                        <Switch>
                            {/* USER ROUTING */}
                            <Route path="/" exact component={Top} />
                            <UserLoginRoute path="/user/login" exact component={UserLogin} />
                            {/* test component */}
                            <UserPrivateRoute path="/user/users" exact component={TestUserIndex} />
                            {/* ADMIN ROUTING */}
                            <AdminLoginRoute path="/admin/login" exact component={AdminLogin} />
                            <AdminPrivateRoute path="/admin/Dashboard" exact component={Dashboard} />
                            <AdminPrivateRoute path="/admin/users" exact component={UserIndex} />
                            <AdminPrivateRoute path="/admin/users/create" exact component={UserCreate} />
                            <AdminPrivateRoute path="/admin/users/:id/edit" exact component={UserEdit} />
                            <AdminPrivateRoute path="/admin/admins" exact component={AdminIndex} />
                            <AdminPrivateRoute path="/admin/admins/create" exact component={AdminCreate} />
                            <AdminPrivateRoute path="/admin/admins/:id/edit" exact component={AdminEdit} />
                            <AdminPrivateRoute path="/admin/notifications" exact component={NotificationIndex} />
                            <AdminPrivateRoute path="/admin/notifications/create" exact component={NotificationCreate} />
                            <AdminPrivateRoute path="/admin/notifications/:id/edit" exact component={NotificationEdit} />
                            <AdminPrivateRoute path="/admin/contacts" exact component={ContactIndex} />
                            <AdminPrivateRoute path="/admin/contacts/:id/edit" exact component={ContactEdit} />
                            <AdminPrivateRoute path="/admin/items" exact component={ItemIndex} />
                            <AdminPrivateRoute path="/admin/items/create" exact component={ItemCreate} />
                            <AdminPrivateRoute path="/admin/items/:id/edit" exact component={ItemEdit} />
                            <AdminPrivateRoute path="/admin/blogs" exact component={BlogIndex} />
                            <AdminPrivateRoute path="/admin/blogs/create" exact component={BlogCreate} />
                            <AdminPrivateRoute path="/admin/blogs/:id/edit" exact component={BlogEdit} />
                            <AdminPrivateRoute path="/admin/news" exact component={NewsIndex} />
                            <AdminPrivateRoute path="/admin/news/create" exact component={NewsCreate} />
                            <AdminPrivateRoute path="/admin/news/:id/edit" exact component={NewsEdit} />
                            <AdminPrivateRoute path="/admin/orders" exact component={OrderIndex} />
                            <AdminPrivateRoute path="/admin/orders/:id/edit" exact component={OrderEdit} />
                            {/* NOT FOUND PAGE */}
                            <Route component={NotFound} />
                        </Switch>
                    </Suspense>
                </main>
            }
            <Footer />
        </BrowserRouter>
    );
}

export default Router;
