import gql from 'graphql-tag';

//======== Address CRUD=========//
export const customerAddressCreate = gql`
mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
    customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
      customerAddress {
       id
       address1
       address2
       city
       company
       country
       province
       zip  
      }
      customerUserErrors {
        message
        field
      }
    }
  }
`

export const customerAddressUpdate = gql`
mutation customerAddressUpdate($address: MailingAddressInput!, $customerAccessToken: String!, $id: ID!) {
    customerAddressUpdate(address: $address, customerAccessToken: $customerAccessToken, id: $id) {
      customerAddress {
        id
        address1
        address2
        city
        company
        country
        province
        zip 
      }
      customerUserErrors {
        message
        field
      }
    }
  }
`


export const customerAddressDelete = gql`
mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        message
        field
      }
      deletedCustomerAddressId
    }
  }
`

export const customerDefaultAddressUpdate = gql`
mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
    customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
      customer {
        id
      }
      customerUserErrors {
        message
        field
      }
    }
  }
`

//=========Customer CRUD=========//

export const customerAccessTokenDelete = gql`
mutation customerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    deletedCustomerAccessTokenId
    userErrors {
      field
      message
    }
  }
}
`;

export const customerAccessTokenCreate = gql`
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        message
        field
      }
    }
  }
`;

export const customerUpdate = gql`
mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
    customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
      customer {
        id
        firstName
        lastName
        phone
        email
        displayName
        acceptsMarketing
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        message
        field
      }
    }
  }`

export const customerCreate = gql`
mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        phone
        email
        displayName
        acceptsMarketing
      }
      customerUserErrors {
        message
        field
      }
    }
  }
`;

export const custQuery = gql`
  query  customer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        phone
        email
        displayName
        acceptsMarketing
        defaultAddress{
            id
            address1
            address2
            city
            company
            country
            province
            zip 
        }
        addresses(first:5) {
            edges{
                node{
                    id
                    address1
                    address2
                    city
                    company
                    country
                    province
                    zip
                }
            } 
        }
      }
    }

`;

//=======checkout CRUD========//
export const CheckoutFragment = gql`
  fragment CheckoutFragment on Checkout {
    id
    webUrl
    totalTax
    subtotalPrice
    totalPrice
    email
    orderStatusUrl
    shippingAddress{
       id
       address1
       address2
       city
       company
       country
       province
       zip  
       name
       phone
    }
    availableShippingRates{
      ready
      shippingRates{
        handle
        price
        title
      }
    }
    lineItemsSubtotalPrice
    {amount}
    appliedGiftCards{
          id
          amountUsed
    }
    discountApplications (first:10){
      edges{
        node {
          value
          allocationMethod
          targetSelection
          targetType
        }
      }
    }
    lineItems (first: 250) {
      edges {
        node {
          id
          title
          discountAllocations{
            allocatedAmount{
              amount
            }
          }
          variant {
            id
            title
            image {
              src
            }
            price
          }
          quantity
        }
      }
    }
  }
`;

export const createCheckout = gql`
  mutation checkoutCreate ($input: CheckoutCreateInput!){
    checkoutCreate(input: $input) {
      userErrors {
        message
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutLineItemsAdd = gql`
mutation checkoutLineItemsAdd ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
  checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
    userErrors {
      message
      field
    }
    checkout {
      ...CheckoutFragment
    }
  }
}
  ${CheckoutFragment}
`;

export const checkoutLineItemsRemove = gql`
mutation checkoutLineItemsRemove ($checkoutId: ID!, $lineItemIds: [ID!]!) {
  checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
    userErrors {
      message
      field
    }
    checkout {
      ...CheckoutFragment
    }
  }
}${CheckoutFragment}
`;

export const checkoutLineItemsUpdate = gql`
  mutation checkoutLineItemsReplace ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
      userErrors {
        message
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkQuery = gql`
query  node($id: ID!) {
  node(id: $id) {    
    id
    ... on Checkout {
      ...CheckoutFragment
    } 
  }
}${CheckoutFragment}`

export const checkoutDiscountCodeApply = gql`
  mutation checkoutDiscountCodeApply ($checkoutId: ID!, $discountCode: String!) {
    checkoutDiscountCodeApply(checkoutId: $checkoutId, discountCode: $discountCode) {
      userErrors {
        message
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutDiscountCodeRemove  = gql`
mutation checkoutDiscountCodeRemove($checkoutId: ID!) {
  checkoutDiscountCodeRemove(checkoutId: $checkoutId) {
    checkout {
      ...CheckoutFragment
    }
    checkoutUserErrors {
      message
      field
    }
  }
} ${CheckoutFragment}`

export const checkoutShippingAddressUpdate  = gql`
mutation checkoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
  checkoutShippingAddressUpdate(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
    checkout {
      ...CheckoutFragment
    }
    checkoutUserErrors {
      message
      field
    }
  }
} ${CheckoutFragment}`

export const checkoutEmailUpdate  = gql`
mutation checkoutEmailUpdate($checkoutId: ID!, $email: String!) {
  checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
    checkout {
      ...CheckoutFragment
    }
    checkoutUserErrors {
      message
      field
    }
  }
}${CheckoutFragment}`

export const discountCodeBasicCreate = gql`
mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
    userErrors { field message code }
    codeDiscountNode {
      id
        codeDiscount {
        ... on DiscountCodeBasic {
          title
          summary
          status
          codes (first:10) {
            edges {
              node {
                code
              }
            }
          }
        }
      }
    }
  }
}`


//=======product CRUD========//
export const productsQuery = gql`
query query {
 
    products(first:8) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          title
          description
          descriptionHtml
          productType
          totalInventory
          options {
            id
            name
            values
          }
          variants(first: 250) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                id
                title
                selectedOptions {
                  name
                  value
                }
                image {
                  src
                }
                price
              }
            }
          }
          images(first: 1) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                src
              }
            }
          }
        }
      }
    }
}
`;


//=======================cart=================================//

export const CartFragment = gql`
  fragment CartFragment on Cart {
    id
    checkoutUrl
    lines (first: 250) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              quantityAvailable
              availableForSale
              product{
                title
              }
              image{
                url
              }
              price
            }
          }
        }
      }
    }
    estimatedCost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
  }
`;

export const createCart = gql`
mutation cartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      ...CartFragment
    }
    userErrors {
      message
      field
    }
  }
} ${CartFragment}
`;

export const cartQuery = gql`
query  cart($id: ID!) {
  cart(id: $id) {    
    id
    ... on Cart {
      ...CartFragment
    } 
  }
}${CartFragment}`;

export const cartLinesAdd = gql`
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
    userErrors {
      message
      field
    }
  }
} ${CartFragment}
`;

export const cartLinesUpdate = gql`
mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
    userErrors {
      field
      message
    }
  }
}${CartFragment}
`;

export const cartLinesRemove = gql`
mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ...CartFragment
    }
    userErrors {
      field
      message
    }
  }
}${CartFragment}
`;