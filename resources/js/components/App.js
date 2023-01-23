import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // routing
import ErrorBoundary from './ErrorBoundary';
import { ParamsProvider } from './context/ParamsContext';

// routing test
import UserIndex from './UserIndex';
import TestNavBar from './TestNavBar';
import TestTop from './TestTop';
import UserEdit from "./UserEdit";
import UserCreate from "./UserCreate";

function App() {

    return (
        <ErrorBoundary>
            <Router>
                <div>
                    <TestNavBar />
                    <Switch>
                        <Route path="/" exact component={TestTop} />
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
