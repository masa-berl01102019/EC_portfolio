import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './ErrorBoundary';
import { ParamsProvider } from './context/ParamsContext';
import { AuthProvider } from './context/AuthContext';
import StripeProvider from './context/StripeContext';
import Router from './Router';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // 個別ページで読み込むとbuild直後だけエラーになるのでここで読み込む
import { CookiesProvider } from 'react-cookie';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ParamsProvider>
                    <CookiesProvider>
                        <StripeProvider>
                            <Router />
                        </StripeProvider>
                    </CookiesProvider>  
                </ParamsProvider>
            </AuthProvider>
        </ErrorBoundary>
    )
}

if (document.getElementById('test')) {
    ReactDOM.render(<App />, document.getElementById('test'));
}
