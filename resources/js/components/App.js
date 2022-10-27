import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary';
import StripeProvider from './context/StripeContext';
import Router from './Router';
import { CookiesProvider } from 'react-cookie';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { NotifyProvider } from './context/NotifyContext';


// React Query will consider cached data as stale. Stale queries are re-fetched automatically in the background when:
// ・New instances of the query mount
// ・The window is refocused
// ・The network is reconnected
// ・The query is optionally configured with a refetch interval.
// You can turn off most of the defaults by passing defaultOptions as config parameter
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true, // automatically requests fresh data in the background if user leaves the app and returns to stale data
            refetchOnmount: true, // if true, refetch on mount if the data is stale.
            refetchOnReconnect: true, // if true, refetch on reconnect if the data is stale.
            retry: false, // if true, failed queries will retry infinitely.
            // cacheTime: 5,
            // staleTime: 1*60*1000, // the time in milliseconds after data is considered stale. Defaults to 0
            suspense: true
        }
    }
});

function App() {
    return (
        <ErrorBoundary>
            <RecoilRoot>
                <CookiesProvider>
                    <StripeProvider>
                        <NotifyProvider>
                            <QueryClientProvider client={queryClient}>
                                <Router />
                                <ReactQueryDevtools initialIsOpen={false} />
                            </QueryClientProvider>
                        </NotifyProvider>
                    </StripeProvider>
                </CookiesProvider>
            </RecoilRoot>
        </ErrorBoundary>
    )
}

const container = document.getElementById('test');
const root = createRoot(container);
root.render(<App/>);
