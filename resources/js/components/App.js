import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // routing
import ErrorBoundary from './ErrorBoundary';
import { ParamsProvider } from './context/ParamsContext';

// routing test
import AdminNavBar from './AdminNavBar';
import Dashboard from './admin/dashboard/Dashboard';
import UserIndex from './admin/users/UserIndex';
import UserEdit from "./admin/users/UserEdit";
import UserCreate from "./admin/users/UserCreate";
import AdminIndex from './admin/admins/AdminIndex';
import AdminEdit from "./admin/admins/AdminEdit";
import AdminCreate from "./admin/admins/AdminCreate";

function App() {

    return (
        <ErrorBoundary>
            <Router>
                <AdminNavBar />
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <ParamsProvider>
                        <Route path="/admin/users" exact component={UserIndex} />
                        <Route path="/admin/users/create" exact component={UserCreate} />
                        <Route path="/admin/users/:id/edit" exact component={UserEdit} />
                        <Route path="/admin/admins" exact component={AdminIndex} />
                        <Route path="/admin/admins/create" exact component={AdminCreate} />
                        <Route path="/admin/admins/:id/edit" exact component={AdminEdit} />
                    </ParamsProvider>
                </Switch>
            </Router>
        </ErrorBoundary>
    )
}

if (document.getElementById('test')) {
    ReactDOM.render(<App />, document.getElementById('test'));
}
