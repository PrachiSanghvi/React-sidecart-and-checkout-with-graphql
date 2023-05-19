import { call, put, takeLatest } from "redux-saga/effects";
import {fetchProducts,fetchProductById} from './../apis/Api'
import {PRODUCT_FETCH_BY_ID_SUCCEEDED,PRODUCT_FETCH_BY_ID_REQUESTED,PRODUCT_FETCH_BY_ID_FAILED, PRODUCT_FETCH_FAILED,PRODUCT_FETCH_REQUESTED,PRODUCT_FETCH_SUCCEEDED} from './../types/productType'

function* fetchProduct(action) {
  try {
    const products = yield call(fetchProducts);
    console.log("products=====",products)
    yield put({
      type: PRODUCT_FETCH_SUCCEEDED,
      payload: products
    });
  } catch (e) {
    yield put({ type: PRODUCT_FETCH_FAILED, payload: e.message });
  }
}

function* fetchProductsById(payload) {
  try {
    
    const products = yield call(fetchProductById,"gid://shopify/Product/"+payload?.payload);
    
    yield put({
      type: PRODUCT_FETCH_BY_ID_SUCCEEDED,
      payload: products
    });
  } catch (e) {
    console.log("e===",e)
    yield put({ type: PRODUCT_FETCH_BY_ID_FAILED, payload: e.message });
  }
}

function* rootSaga() {
  yield takeLatest(PRODUCT_FETCH_REQUESTED, fetchProduct);
  yield takeLatest(PRODUCT_FETCH_BY_ID_REQUESTED, fetchProductsById);
}

export default rootSaga;
