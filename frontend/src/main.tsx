import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ApolloProvider } from './ApolloProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider>
            <App />
        </ApolloProvider>
    </React.StrictMode>
);