import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './ErrorBoundary';
import { ParamsProvider } from './context/ParamsContext';
import { AuthProvider } from './context/AuthContext';
import Router from './Router';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ParamsProvider>
                    <Router />
                </ParamsProvider>
            </AuthProvider>
        </ErrorBoundary>
    )
}

if (document.getElementById('test')) {
    ReactDOM.render(<App />, document.getElementById('test'));
}
