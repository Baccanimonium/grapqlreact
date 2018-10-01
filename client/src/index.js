/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import Routes from './Routes';

const history = createBrowserHistory();

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
            headers: {
                authorization: token,
            },
        });
    },
    onError:({ networkError }) => {
        if (networkError) {
            console.log('Network Error', networkError);
        }
        if (networkError.statusCode === 401) {
            localStorage.removeItem('token');
        }
    }
});


ReactDOM.render(
    <ApolloProvider client={client}>
        <Router history={history}>
            <Routes />
        </Router>
    </ApolloProvider>,
    document.getElementById('root')
);
