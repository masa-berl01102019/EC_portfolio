import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // routing
import ErrorBoundary from './ErrorBoundary';
import { ParamsProvider } from './context/ParamsContext';

// routing test
import UserIndex from './admin/users/UserIndex';
import AdminNavBar from './AdminNavBar';
import Dashboard from './admin/dashboard/Dashboard';
import UserEdit from "./admin/users/UserEdit";
import UserCreate from "./admin/users/UserCreate";

function App() {

    return (
        <ErrorBoundary>
            <Router>
                <div>
                    <AdminNavBar />
                    <Switch>
                        <Route path="/" exact component={Dashboard} />
                        <ParamsProvider>
                            <Route path="/admin/users" exact component={UserIndex} />
                            <Route path="/admin/users/create" exact component={UserCreate} />
                            <Route path="/admin/users/:id/edit" exact component={UserEdit} />
                        </ParamsProvider>
                    </Switch>
                </div>
            </Router>
        </ErrorBoundary>
    )
}

if (document.getElementById('test')) {
    ReactDOM.render(<App />, document.getElementById('test'));
}
