import { PRODUCT_FETCH_BY_ID_FAILED, PRODUCT_FETCH_BY_ID_SUCCEEDED, PRODUCT_FETCH_FAILED, PRODUCT_FETCH_SUCCEEDED } from "../types/productType";

const initialState = {
  products: [],
  product:{}
};
const products = (state = { ...initialState }, action) => {
 
  switch (action.type) {
    case PRODUCT_FETCH_SUCCEEDED:
      return {...state,products:action.payload,error:null}
    case PRODUCT_FETCH_FAILED:
      return {...state,products:[],error:action.payload}  
    case PRODUCT_FETCH_BY_ID_SUCCEEDED:
      return {...state,product:action.payload,error:null}
    case PRODUCT_FETCH_BY_ID_FAILED:
      return {...state,product:{},error:action.payload}  
    default:
      return state;    
  }
  
};

export default products;

