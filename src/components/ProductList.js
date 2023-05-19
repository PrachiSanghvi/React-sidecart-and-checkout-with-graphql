import { fetchProductsSuccess } from './../actions/productActions'
import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import ProductCard from './../components/ProductCard';
import { Row } from 'reactstrap';
import {productsQuery} from './../apis/gqlApi';
import { useQuery } from '@apollo/client';
import Header from './Header';


function ProductList() {

  const [products, setProducts] = useState([]);
  const { loading, data } = useQuery(productsQuery);


  useEffect(() => {
    // fetchProducts()
    setProducts(data?.products?.edges);
  }, [data]);


  //ele?.id.match(/(\d+)/).length ? ele?.id.match(/(\d+)/)[0] : 0

  return (
    <div className="App">
      <Header/>
      <h1>Products</h1>
      <Row style={{ margin: 'auto' }}>
        {loading && <h1>Loading ...</h1>}
        {products?.map((ele, i) =>
          <ProductCard key={i} product={ele} id={ele?.node?.id.match(/(\d+)/).length ? ele?.node?.id.match(/(\d+)/)[0] : 0} title={ele?.node?.title} productType={ele?.node?.productType} src={ele?.node?.images?.edges[0]?.node?.src} />)}
      </Row>
    </div>
  );
}


const mapStateToProps = (state) => ({
  products: state.products
});

const mapDispatchToProps = (dispatch) => ({
  fetchProducts: () => dispatch(fetchProductsSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);

