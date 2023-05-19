import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {  Provider } from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { ApolloClient } from 'apollo-client';
// import { createHttpLink } from 'apollo-link-http';
import { setContext } from '@apollo/client/link/context';
// import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import 'react-notifications/lib/notifications.css';

// export const client = new Client(typeBundle, {
//    url: 'https://loja-chicletz-2.myshopify.com/api/graphql',
//    fetcherOptions: {
//      headers: {
//        'X-Shopify-Storefront-Access-Token': 'a22160ca4370761f4d06a2debbc4c269'
//      }
//    }
//  });

 
const httpLink = createHttpLink({ uri: 'https://loja-chicletz-2.myshopify.com/api/2022-04/graphql.json' })

const middlewareLink = setContext(() => ({
  headers: {
    'X-Shopify-Storefront-Access-Token': 'a22160ca4370761f4d06a2debbc4c269'
  }
}))

const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Provider store={store}>
     <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
     </Provider>
   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
