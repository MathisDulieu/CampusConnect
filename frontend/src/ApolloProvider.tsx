import React from 'react';
import { ApolloProvider as Provider } from '@apollo/client';
import { apolloClient } from './hooks/graphqlConfig';

interface ApolloProviderProps {
    children: React.ReactNode;
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
    return (
        <Provider client={apolloClient}>
            {children}
        </Provider>
    );
};