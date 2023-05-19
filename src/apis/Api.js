import Client from 'shopify-buy';
import {gql} from 'graphql-tag'

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
  domain: 'loja-chicletz-2.myshopify.com',
  storefrontAccessToken: 'a22160ca4370761f4d06a2debbc4c269'
});


export const fetchProducts = async () => {
   return await client.product.fetchAll().then((products) => {
        return products;
    }).catch((e)=>{
        return e;
    });
}

export const fetchProductById = async (productId) => {
   return await client.product.fetch(productId).then((product) => {        
        return product;
      }).catch((e)=>{
          console.log("e===",e)
         return e;
     });
 }
  

 //=================================================//

export const queryString = gql`
query products {
  shop {
    products(first: 3) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
}
`;
