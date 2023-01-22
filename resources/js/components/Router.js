import React, {useEffect, Suspense, lazy} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {CircularProgress} from "@material-ui/core";
import {UserPrivateRoute, UserLoginRoute,AdminPrivateRoute, AdminLoginRoute} from './GuardRoute';
import { useSetRecoilState } from 'recoil';
import { authAdminState, authUserState } from './store/authState';
import useAuth from './hooks/useAuth';
import ErrorBoundary from './ErrorBoundary';

// Fixed routes
import {Header as AdminHeader} from "./organisms/admin/Header/Header";
import {Header as UserHeader} from "./organisms/user/Header/Header";
import {Footer as AdminFooter} from "./organisms/admin/Footer/Footer";
import {Footer as UserFooter} from "./organisms/user/Footer/Footer";
import Text from './atoms/Text/Text';

// Page component for user
const TopPage = lazy(() => import( "./pages/user/TopPage" ));
const HistoryPage = lazy(() => import( "./pages/user/HistoryPage" ));
const ItemIndexPage = lazy(() => import( "./pages/user/items/ItemIndexPage" ));
const ItemShowPage = lazy(() => import( "./pages/user/items/ItemShowPage" ));
const ItemRankPage = lazy(() => import( "./pages/user/items/ItemRankPage" ));
const ItemRecommendPage = lazy(() => import( "./pages/user/items/ItemRecommendPage" ));
const ItemNewPage = lazy(() => import( "./pages/user/items/ItemNewPage" ));
const BlogIndexPage = lazy(() => import( "./pages/user/blogs/BlogIndexPage" ));
const BlogShowPage = lazy(() => import( "./pages/user/blogs/BlogShowPage" ));
const NewsIndexPage = lazy(() => import( "./pages/user/news/NewsIndexPage" ));
const NewsShowPage = lazy(() => import( "./pages/user/news/NewsShowPage" ));
const NotificationIndexPage = lazy(() => import( "./pages/user/notifications/NotificationIndexPage" ));
const CartIndexPage = lazy(() => import( "./pages/user/carts/CartIndexPage" ));
const CartConfirmPage = lazy(() => import( "./pages/user/carts/CartConfirmPage" ));
const CartCompletePage = lazy(() => import( "./pages/user/carts/CartCompletePage" ));
const CartErrorPage = lazy(() => import( "./pages/user/carts/CartErrorPage" ));
const BookmarkIndexPage = lazy(() => import( "./pages/user/bookmarks/BookmarkIndexPage" ));
const OrderIndexPage = lazy(() => import( "./pages/user/orders/OrderIndexPage" ));
const UserLogin = lazy(() => import( "./pages/user/auth/UserLogin" ));
const UserResetPassword = lazy(() => import( "./pages/user/auth/UserResetPassword" ));
const UserChangePassword = lazy(() => import( "./pages/user/auth/UserChangePassword" ));
const UserCreatePage = lazy(() => import( "./pages/user/users/UserCreatePage" ));
const ContactCreatePage = lazy(() => import( "./pages/user/contacts/ContactCreatePage" ));
const ContactCompletePage = lazy(() => import( "./pages/user/contacts/ContactCompletePage" ));
const UserEditPage = lazy(() => import( "./pages/user/users/UserEditPage" ));
const UserEditCompletePage = lazy(() => import( "./pages/user/users/UserEditCompletePage" ));
const UserDeletePage = lazy(() => import( "./pages/user/users/UserDeletePage" ));
// Page component for admin
const AdminLogin = lazy(() => import( "./pages/admin/auth/AdminLogin" ));
const AdminResetPassword = lazy(() => import( "./pages/admin/auth/AdminResetPassword" ));
const AdminChangePassword = lazy(() => import( "./pages/admin/auth/AdminChangePassword" ));
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
// Page component for error
const NotFound = lazy(() => import( "./pages/error/NotFound" ));



function Router() {
    // Call global state for user and admin
    const setIsUserLogin = useSetRecoilState(authUserState);
    const setIsAdminLogin = useSetRecoilState(authAdminState);
    // Get previous URL when reloading
    const prevUrl = window.location.pathname;
    // Get characters which is after domain from access URL
    const str = prevUrl.substring( 1, 6 );
    // Judge whether access is for admin pages or general user page from str variable because admin page's URL start with domain/admin/*.
    const auth = str !== 'admin' ? 'user': 'admin';
    // Get Auth data from API
    const {data, errorMessage} = useAuth(`/api/${auth}/auth`, auth);

    useEffect(() => {
        // It will return the name if auth has been logged in
        if(data) {
            // Set login status true to retain it when browser reloads
            if(auth === 'user') {
                setIsUserLogin(true);
            } else if (auth === 'admin') {
                setIsAdminLogin(true);
            }
        }
    }, []);

    const backgroundColor = auth === 'user'? '#fff' : '#F2F4F6';

    return (
        <BrowserRouter>
            <div style={{'display' : 'flex', 'flexFlow' :' nowrap column', 'minHeight' : '100vh', 'overflowX' : 'hidden', 'background': backgroundColor} }>
                { auth === 'user' ? 
                    <UserHeader style={{ 'position': 'fixed', 'left' : '0', 'top' : '0', 'right' : '0', 'zIndex' : '999999' }} /> : 
                    <AdminHeader style={{ 'position': 'fixed', 'left' : '0', 'top' : '0', 'right' : '0', 'zIndex' : '999999' }} />
                }
                {/* TODO: Create and embed Error message to fallback UI for production mode */}
                <ErrorBoundary>
                    <Suspense fallback={<CircularProgress disableShrink style={{'margin': '120px auto'}}/>}>
                        <Switch>
                            {/* USER ROUTING */}
                            <Route path="/" exact component={TopPage} />
                            <Route path="/items" exact component={ItemIndexPage} />
                            <Route path="/items/rank" exact component={ItemRankPage} />
                            <Route path="/items/recommend" exact component={ItemRecommendPage} />
                            <Route path="/items/new" exact component={ItemNewPage} />
                            <Route path="/items/:id" exact component={ItemShowPage} />
                            <Route path="/blogs" exact component={BlogIndexPage} />
                            <Route path="/blogs/:id" exact component={BlogShowPage} />
                            <Route path="/news" exact component={NewsIndexPage} />
                            <Route path="/news/:id" exact component={NewsShowPage} />
                            <Route path="/notifications" exact component={NotificationIndexPage} />
                            <Route path="/histories" exact component={HistoryPage} />
                            <Route path="/users/create" exact component={UserCreatePage} />
                            <Route path="/contacts" exact component={ContactCreatePage} />
                            <Route path="/contacts/complete" exact component={ContactCompletePage} />
                            <Route path="/user/reset_password" exact component={UserResetPassword} />
                            <Route path="/user/change_password/:uuid" exact component={UserChangePassword} />
                            <UserLoginRoute path="/user/login" exact component={UserLogin} prevUrl={prevUrl} />
                            <UserPrivateRoute path="/users/edit" exact component={UserEditPage} />
                            <UserPrivateRoute path="/users/edit/complete" exact component={UserEditCompletePage} />
                            <UserPrivateRoute path="/users/delete" exact component={UserDeletePage} />
                            <UserPrivateRoute path="/carts" exact component={CartIndexPage} />
                            <UserPrivateRoute path="/carts/confirm" exact component={CartConfirmPage} />
                            <UserPrivateRoute path="/carts/complete" exact component={CartCompletePage} />
                            <UserPrivateRoute path="/carts/error" exact component={CartErrorPage} />
                            <UserPrivateRoute path="/bookmarks" exact component={BookmarkIndexPage} />
                            <UserPrivateRoute path="/orders" exact component={OrderIndexPage} />
                            {/* ADMIN ROUTING */}
                            <Route path="/admin/reset_password" exact component={AdminResetPassword} />
                            <Route path="/admin/change_password/:uuid" exact component={AdminChangePassword} />
                            <AdminLoginRoute path="/admin/login" exact component={AdminLogin} prevUrl={prevUrl} />
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
                </ErrorBoundary>
                { auth === 'user' ? <UserFooter style={{'marginTop': 'auto'}} /> : <AdminFooter style={{'marginTop': 'auto'}} /> }
            </div>
        </BrowserRouter>
    );

}

export default Router;
