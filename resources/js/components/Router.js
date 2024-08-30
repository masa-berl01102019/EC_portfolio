import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CircularProgress } from "@material-ui/core";
import { UserPrivateRoute, UserLoginRoute, AdminPrivateRoute, AdminLoginRoute } from './GuardRoute';
import { useSetRecoilState } from 'recoil';
import { authAdminState, authUserState } from './store/authState';
import useAuth from './hooks/useAuth';
import ErrorBoundary from './ErrorBoundary';
import ApplicationError from './pages/error/ApplicationError';

// Fixed routes
import { Header as AdminHeader } from "./organisms/admin/Header/Header";
import { Header as UserHeader } from "./organisms/user/Header/Header";
import { Footer as AdminFooter } from "./organisms/admin/Footer/Footer";
import { Footer as UserFooter } from "./organisms/user/Footer/Footer";

// Page component for user
const TopPage = lazy(() => import(/* webpackChunkName: "TopPage" */ "./pages/user/TopPage"));
const HistoryPage = lazy(() => import(/* webpackChunkName: "HistoryPage" */ "./pages/user/HistoryPage"));
const ItemIndexPage = lazy(() => import(/* webpackChunkName: "ItemIndexPage" */ "./pages/user/items/ItemIndexPage"));
const ItemShowPage = lazy(() => import(/* webpackChunkName: "ItemShowPage" */ "./pages/user/items/ItemShowPage"));
const ItemRankPage = lazy(() => import(/* webpackChunkName: "ItemRankPage" */ "./pages/user/items/ItemRankPage"));
const ItemRecommendPage = lazy(() => import(/* webpackChunkName: "ItemRecommendPage" */ "./pages/user/items/ItemRecommendPage"));
const ItemNewPage = lazy(() => import(/* webpackChunkName: "ItemNewPage" */ "./pages/user/items/ItemNewPage"));
const BlogIndexPage = lazy(() => import(/* webpackChunkName: "BlogIndexPage" */ "./pages/user/blogs/BlogIndexPage"));
const BlogShowPage = lazy(() => import(/* webpackChunkName: "BlogShowPage" */ "./pages/user/blogs/BlogShowPage"));
const NewsIndexPage = lazy(() => import(/* webpackChunkName: "NewsIndexPage" */ "./pages/user/news/NewsIndexPage"));
const NewsShowPage = lazy(() => import(/* webpackChunkName: "NewsShowPage" */ "./pages/user/news/NewsShowPage"));
const NotificationIndexPage = lazy(() => import(/* webpackChunkName: "NotificationIndexPage" */ "./pages/user/notifications/NotificationIndexPage"));
const CartIndexPage = lazy(() => import(/* webpackChunkName: "CartIndexPage" */ "./pages/user/carts/CartIndexPage"));
const CartConfirmPage = lazy(() => import(/* webpackChunkName: "CartConfirmPage" */ "./StripeWrapper"));
const CartCompletePage = lazy(() => import(/* webpackChunkName: "CartCompletePage" */ "./pages/user/carts/CartCompletePage"));
const CartErrorPage = lazy(() => import(/* webpackChunkName: "CartErrorPage" */ "./pages/user/carts/CartErrorPage"));
const BookmarkIndexPage = lazy(() => import(/* webpackChunkName: "BookmarkIndexPage" */ "./pages/user/bookmarks/BookmarkIndexPage"));
const OrderIndexPage = lazy(() => import(/* webpackChunkName: "OrderIndexPage" */ "./pages/user/orders/OrderIndexPage"));
const UserLogin = lazy(() => import(/* webpackChunkName: "UserLogin" */ "./pages/user/auth/UserLogin"));
const UserResetPassword = lazy(() => import(/* webpackChunkName: "UserResetPassword" */ "./pages/user/auth/UserResetPassword"));
const UserChangePassword = lazy(() => import(/* webpackChunkName: "UserChangePassword" */ "./pages/user/auth/UserChangePassword"));
const UserCreatePage = lazy(() => import(/* webpackChunkName: "UserCreatePage" */ "./pages/user/users/UserCreatePage"));
const ContactCreatePage = lazy(() => import(/* webpackChunkName: "ContactCreatePage" */ "./pages/user/contacts/ContactCreatePage"));
const ContactCompletePage = lazy(() => import(/* webpackChunkName: "ContactCompletePage" */ "./pages/user/contacts/ContactCompletePage"));
const UserEditPage = lazy(() => import(/* webpackChunkName: "UserEditPage" */ "./pages/user/users/UserEditPage"));
const UserEditCompletePage = lazy(() => import(/* webpackChunkName: "UserEditCompletePage" */ "./pages/user/users/UserEditCompletePage"));
const UserDeletePage = lazy(() => import(/* webpackChunkName: "UserDeletePage" */ "./pages/user/users/UserDeletePage"));
// Page component for admin
const AdminLogin = lazy(() => import(/* webpackChunkName: "AdminLogin" */ "./pages/admin/auth/AdminLogin"));
const AdminResetPassword = lazy(() => import(/* webpackChunkName: "AdminResetPassword" */ "./pages/admin/auth/AdminResetPassword"));
const AdminChangePassword = lazy(() => import(/* webpackChunkName: "AdminChangePassword" */ "./pages/admin/auth/AdminChangePassword"));
const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ './pages/admin/dashboard/Dashboard'));
const UserIndex = lazy(() => import(/* webpackChunkName: "UserIndex" */ './pages/admin/users/UserIndex'));
const UserEdit = lazy(() => import(/* webpackChunkName: "UserEdit" */ "./pages/admin/users/UserEdit"));
const UserCreate = lazy(() => import(/* webpackChunkName: "UserCreate" */ "./pages/admin/users/UserCreate"));
const AdminIndex = lazy(() => import(/* webpackChunkName: "AdminIndex" */ './pages/admin/admins/AdminIndex'));
const AdminEdit = lazy(() => import(/* webpackChunkName: "AdminEdit" */ "./pages/admin/admins/AdminEdit"));
const AdminCreate = lazy(() => import(/* webpackChunkName: "AdminCreate" */ "./pages/admin/admins/AdminCreate"));
const NotificationIndex = lazy(() => import(/* webpackChunkName: "NotificationIndex" */ "./pages/admin/notifications/NotificationIndex"));
const NotificationCreate = lazy(() => import(/* webpackChunkName: "NotificationCreate" */ "./pages/admin/notifications/NotificationCreate"));
const NotificationEdit = lazy(() => import(/* webpackChunkName: "NotificationEdit" */ "./pages/admin/notifications/NotificationEdit"));
const ContactIndex = lazy(() => import(/* webpackChunkName: "ContactIndex" */ "./pages/admin/contacts/ContactIndex"));
const ContactEdit = lazy(() => import(/* webpackChunkName: "ContactEdit" */ "./pages/admin/contacts/ContactEdit"));
const ItemIndex = lazy(() => import(/* webpackChunkName: "ItemIndex" */ "./pages/admin/items/ItemIndex"));
const ItemCreate = lazy(() => import(/* webpackChunkName: "ItemCreate" */ "./pages/admin/items/ItemCreate"));
const ItemEdit = lazy(() => import(/* webpackChunkName: "ItemEdit" */ "./pages/admin/items/ItemEdit"));
const BlogIndex = lazy(() => import(/* webpackChunkName: "BlogIndex" */ "./pages/admin/blogs/BlogIndex"));
const BlogCreate = lazy(() => import(/* webpackChunkName: "BlogCreate" */ "./pages/admin/blogs/BlogCreate"));
const BlogEdit = lazy(() => import(/* webpackChunkName: "BlogEdit" */ "./pages/admin/blogs/BlogEdit"));
const NewsIndex = lazy(() => import(/* webpackChunkName: "NewsIndex" */ "./pages/admin/news/NewsIndex"));
const NewsCreate = lazy(() => import(/* webpackChunkName: "NewsCreate" */ "./pages/admin/news/NewsCreate"));
const NewsEdit = lazy(() => import(/* webpackChunkName: "NewsEdit" */ "./pages/admin/news/NewsEdit"));
const OrderIndex = lazy(() => import(/* webpackChunkName: "OrderIndex" */ "./pages/admin/orders/OrderIndex"));
const OrderEdit = lazy(() => import(/* webpackChunkName: "OrderEdit" */ "./pages/admin/orders/OrderEdit"));
const ColorIndex = lazy(() => import(/* webpackChunkName: "ColorIndex" */ "./pages/admin/colors/ColorIndex"));
const BrandIndex = lazy(() => import(/* webpackChunkName: "BrandIndex" */ "./pages/admin/brands/BrandIndex"));
const TagIndex = lazy(() => import(/* webpackChunkName: "TagIndex" */ "./pages/admin/tags/TagIndex"));
const CategoryIndex = lazy(() => import(/* webpackChunkName: "CategoryIndex" */ "./pages/admin/categories/CategoryIndex"));
const SizeIndex = lazy(() => import(/* webpackChunkName: "SizeIndex" */ "./pages/admin/sizes/SizeIndex"));
// Page component for error
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ "./pages/error/NotFound"));



function Router() {
  // Call global state for user and admin
  const setIsUserLogin = useSetRecoilState(authUserState);
  const setIsAdminLogin = useSetRecoilState(authAdminState);
  // Get previous URL when reloading
  const prevUrl = window.location.pathname;
  // Get characters which is after domain from access URL
  const str = prevUrl.substring(1, 6);
  // Judge whether access is for admin pages or general user page from str variable because admin page's URL start with domain/admin/*.
  const auth = str !== 'admin' ? 'user' : 'admin';
  // Get Auth data from API
  const { data, errorMessage } = useAuth(`/api/${auth}/auth`, auth);

  useEffect(() => {
    // It will return the name if auth has been logged in
    if (data) {
      // Set login status true to retain it when browser reloads
      if (auth === 'user') {
        setIsUserLogin(true);
      } else if (auth === 'admin') {
        setIsAdminLogin(true);
      }
    }
  }, []);

  const backgroundColor = auth === 'user' ? '#fff' : '#F2F4F6';

  return (
    <BrowserRouter>
      <div style={{ 'display': 'flex', 'flexFlow': ' nowrap column', 'minHeight': '100vh', 'overflowX': 'hidden', 'background': backgroundColor }}>
        {auth === 'user' ?
          <UserHeader style={{ 'position': 'fixed', 'left': '0', 'top': '0', 'right': '0', 'zIndex': '999' }} /> :
          <AdminHeader style={{ 'position': 'fixed', 'left': '0', 'top': '0', 'right': '0', 'zIndex': '999' }} />
        }
        <ErrorBoundary fallback={<ApplicationError />}>
          <Suspense fallback={<CircularProgress disableShrink style={{ 'margin': '120px auto' }} />}>
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
        {auth === 'user' ? <UserFooter style={{ 'marginTop': 'auto' }} /> : <AdminFooter style={{ 'marginTop': 'auto' }} />}
      </div>
    </BrowserRouter>
  );

}

export default Router;
