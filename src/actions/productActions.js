import { PRODUCT_FETCH_BY_ID_REQUESTED, PRODUCT_FETCH_REQUESTED } from "../types/productType";

export const fetchProductsSuccess = (payload) => ({
    type: PRODUCT_FETCH_REQUESTED,
    payload: payload
})

export const fetchProductByIdSuccess = (payload) => ({
    type: PRODUCT_FETCH_BY_ID_REQUESTED,
    payload: payload
})


