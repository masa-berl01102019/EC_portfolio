import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // routing

// routing test
import TestUser from './TestUser';
import TestAbout from './TestAbout';
import TestNavBar from './TestNavBar';
import TestTop from './TestTop';

function App() {
    return (
        <Router>
            <div>
                <TestNavBar />
                <Switch>
                    <Route path="/" exact component={TestTop} />
                    <Route path="/about" component={TestAbout} />
                    <Route path="/user" component={TestUser} />
                </Switch>
            </div>
        </Router>
    )
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
