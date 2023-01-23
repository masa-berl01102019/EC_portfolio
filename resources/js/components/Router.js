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
const TopPage = lazy(() => import( "./pages/user/TopPage" ));
const HistoryPage = lazy(() => import( "./pages/user/HistoryPage" ));
const ItemIndexPage = lazy(() => import( "./pages/user/items/ItemIndexPage" ));
const ItemShowPage = lazy(() => import( "./pages/user/items/ItemShowPage" ));
const BlogIndexPage = lazy(() => import( "./pages/user/blogs/BlogIndexPage" ));
const BlogShowPage = lazy(() => import( "./pages/user/blogs/BlogShowPage" ));
const NewsIndexPage = lazy(() => import( "./pages/user/news/NewsIndexPage" ));
const NewsShowPage = lazy(() => import( "./pages/user/news/NewsShowPage" ));
const NotificationIndexPage = lazy(() => import( "./pages/user/notifications/NotificationIndexPage" ));
const CartIndexPage = lazy(() => import( "./pages/user/carts/CartIndexPage" ));
const BookmarkIndexPage = lazy(() => import( "./pages/user/bookmarks/BookmarkIndexPage" ));
const OrderIndexPage = lazy(() => import( "./pages/user/orders/OrderIndexPage" ));
const UserLogin = lazy(() => import( "./pages/user/auth/UserLogin" ));
const UserCreatePage = lazy(() => import( "./pages/user/users/UserCreatePage" ));
const ContactCreatePage = lazy(() => import( "./pages/user/contacts/ContactCreatePage" ));
const UserEditPage = lazy(() => import( "./pages/user/users/UserEditPage" ));
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
const ColorIndex = lazy(() => import( "./pages/admin/colors/ColorIndex" ));
const BrandIndex = lazy(() => import( "./pages/admin/brands/BrandIndex" ));
const TagIndex = lazy(() => import( "./pages/admin/tags/TagIndex" ));
const CategoryIndex = lazy(() => import( "./pages/admin/categories/CategoryIndex" ));
const SizeIndex = lazy(() => import( "./pages/admin/sizes/SizeIndex" ));
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
        console.log('Router.jsが呼ばれた')
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
                            <Route path="/" exact component={TopPage} />
                            <Route path="/items" exact component={ItemIndexPage} />
                            <Route path="/items/:id" exact component={ItemShowPage} />
                            <Route path="/blogs" exact component={BlogIndexPage} />
                            <Route path="/blogs/:id" exact component={BlogShowPage} />
                            <Route path="/news" exact component={NewsIndexPage} />
                            <Route path="/news/:id" exact component={NewsShowPage} />
                            <Route path="/notifications" exact component={NotificationIndexPage} />
                            <Route path="/histories" exact component={HistoryPage} />
                            <Route path="/users/create" exact component={UserCreatePage} />
                            <Route path="/contacts" exact component={ContactCreatePage} />
                            <UserLoginRoute path="/user/login" exact component={UserLogin} />
                            <UserPrivateRoute path="/users/edit" exact component={UserEditPage} />
                            <UserPrivateRoute path="/carts" exact component={CartIndexPage} />
                            <UserPrivateRoute path="/bookmarks" exact component={BookmarkIndexPage} />
                            <UserPrivateRoute path="/orders" exact component={OrderIndexPage} />
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
                            <AdminPrivateRoute path="/admin/colors" exact component={ColorIndex} />
                            <AdminPrivateRoute path="/admin/brands" exact component={BrandIndex} />
                            <AdminPrivateRoute path="/admin/tags" exact component={TagIndex} />
                            <AdminPrivateRoute path="/admin/categories" exact component={CategoryIndex} />
                            <AdminPrivateRoute path="/admin/sizes" exact component={SizeIndex} />
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
