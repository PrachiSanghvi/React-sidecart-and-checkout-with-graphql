import { fetchProductByIdSuccess } from './../actions/productActions'
import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { useLocation } from 'react-router-dom';
import "./../App.scss"
import { Button, Col, Row, Spinner } from 'reactstrap';
import { useMutation, useLazyQuery } from '@apollo/client';
import Header from './Header';
import ImageSlider from './ImageSlider';
import "./../App.scss";
import { NotificationManager } from 'react-notifications';
import {checkoutLineItemsAdd,createCheckout,custQuery,createCart,cartLinesAdd} from "./../apis/gqlApi";

const sizeMapping = {
  "14/16": "S",
  "16/18":"M",
  "18/20": "L",
  "22/24": "X",
  "26/28": "XL",
  "30/32":"XXL",
  "34/36":"XXXL",
  "14": "S",
  "16":"M",
  "18": "L",
  "20": "X",
  "22": "XL",
  "1X": "S",
  "1x": "S",
  "2x":"M",
  "3x": "L",
  "4x": "X",
  "5x": "XL",
  "6X": "XXL",
  "Fits 14 to 18":"S",
  "Fits 16 to 20":"M",
  "Fits 20 to 24":"L"
}

function ProductDetail() {

  // const { id } = useParams();
  const location = useLocation()
  const { product } = location.state

  const [varianntIds, setVariantIds] = useState([])
  const [price, setPrice] = useState(null)
  const [loader, setLoader] = useState(false);
  const [openSideCart, setOpenSideCart] = useState(false);
  const [checkoutData,setCheckoutData] = useState({});
  const [variants,setVariants] = useState({});
  const [createCheckoutMutation] = useMutation(createCheckout);
  const [createCartMutation] = useMutation(createCart);
  const [checkoutLineItemsAddMutation] = useMutation(checkoutLineItemsAdd);
  const [cartLinesAddMutation] = useMutation(  cartLinesAdd  );
  const [customerQuery,{ loading, error, data  } ] = useLazyQuery(custQuery,{fetchPolicy: "network-only" });

  useEffect(()=>{
     customerQuery( {
             variables: { customerAccessToken: localStorage.getItem("token") }
          });
  },[])

  useEffect(() => {
    let variant = {};
    console.log(product)
    if (product?.node?.variants?.edges.length) {
      setPrice(product?.node?.variants?.edges[0]?.node?.price);
      product?.node?.options?.map((e,i)=>{
          variant={...variant,[e?.name]:  e?.values[0] }
      })
      setVariantIds([product?.node?.variants?.edges[0]?.node?.id])
      setVariants(variant);
    }

  }, [product]);

  // useEffect(() => {
  //   setData(product)
  // }, [product])

  const onVarinatClick = (name,val)=>{

    setVariants({...variants,[name]:val});
    setOpenSideCart(false); 

    product?.node?.variants?.edges?.map((ele)=>{
      const options = ele?.node?.title?.split(" / ")
      let count = 0;

      console.log(count);

      Object.entries({...variants,[name]:val})?.map((value)=>{
        console.log("value=====",value[1],options?.includes(value[1]));
        if(options?.includes(value[1])){
          count = count +1;
        }
      })
      
      console.log(count)
      if(count === options.length){
        console.log("varianntIds  =====",varianntIds,ele?.node?.id)
        setVariantIds([ele?.node?.id]);
        setPrice(ele?.node?.price)
      }
      
    })
  }

  const handleCheckout = () => {
  
    let lineItems = varianntIds.map(e => ({ merchandiseId: e, quantity: 1 }))
    let variables = { input: { lineItems: lineItems } };

    console.log("varianntIds=====",varianntIds)
    setLoader(true);
    setOpenSideCart(false);

    if(localStorage.getItem("cartId")){
      cartLinesAddMutation({ variables: {cartId:localStorage.getItem("cartId"),lines:lineItems }}).then(
        res => {
          console.log(res);
          setLoader(false);
          setCheckoutData(res?.data?.cartLinesAdd?.cart)
          NotificationManager.success("Product added to cart!", 'Success')
          setOpenSideCart(true);
        },
        err => {
          console.log('create checkout error', err);
          setLoader(false);
          setOpenSideCart(true);
        }
      );
    }else{
      // const address = data?.customer?.defaultAddress;
      // delete address?.__typename
      // delete address?.id
      // createCheckoutMutation({ variables:{...variables,input:{...variables.input,email:data?.customer?.email,shippingAddress:{...address,firstName:data?.customer?.firstName,lastName:data?.customer?.lastName}}} }).then(
      //   res => {
      //     console.log(res);
      //     setLoader(false);
      //     localStorage.setItem("cartId",res?.data?.checkoutCreate?.checkout?.id)
      //     setCheckoutData(res?.data?.checkoutCreate?.checkout)
      //     NotificationManager.success("Item added to cart!", 'Success')
      //     setOpenSideCart(true);
      //   },
      //   err => {
      //     console.log('create checkout error', err);
      //     setLoader(false);
      //     setOpenSideCart(true);
      //   }
      // );

      createCartMutation({ variables:{...variables,input:{lines:lineItems}} }).then(
        res => {
          console.log(res);
          setLoader(false);
          localStorage.setItem("cartId",res?.data?.cartCreate?.cart?.id)
          setCheckoutData(res?.data?.cartCreate?.cart)
          NotificationManager.success("Item added to cart!", 'Success')
          setOpenSideCart(true);
        },
        err => {
          console.log('create checkout error', err);
          setLoader(false);
          setOpenSideCart(true);
        }
      );
    }
    
  }


  return (
    <div className='product-detail-wrp'>
      <Header checkoutData={checkoutData} openSideCart={openSideCart} setOpenSideCart={setOpenSideCart}/>
      <h1>Product Detail</h1>
      <Row style={{margin:0}}>
        <Col className='sm-6'>
          <ImageSlider images={product?.node?.variants?.edges} />
        </Col>
        <Col className='sm-6'>
          <h3>{product?.node?.title}({product?.node?.productType})</h3>

          <h5 className='m-2'>${price}</h5>

          {
             product?.node?.options?.map((val,ind)=>(

              <Row className='m-0' key={ind}>
              <Col sm="2">{val?.name}:</Col>
              
            
              
                <Col sm="12" className='size-btn-wrp'>
                  {val?.values?.map((ele, index) => (
                    <Button
                      id={index}
                      key={index}
                      style={{marginLeft:"15px"}}
                      className={variants[val?.name] === ele ? "size-btn-selected" : "size-btn"}
                      onClick={(e) => onVarinatClick(val?.name,ele)}
                      value={""} >
                      {val?.name === "Size" ? sizeMapping[ele] : ele}
                    </Button>
                 ))} 

              </Col> 
          </Row>

            ))
          }
          {/* <Row className='m-0'>
            <Col sm="2">Size:</Col>
            <Col sm="12" className='size-btn-wrp'>

              {product?.node?.variants?.edges?.map((ele, index) => (
                <Button
                  id={index}
                  key={index}
                  style={{marginLeft:"15px"}}
                  className={varianntIds.includes(ele?.node?.id) ? "size-btn-selected" : "size-btn"}
                  onClick={(e) => { setVariantIds([e.target.value]); setPrice(ele?.node?.id === e.target.value && ele?.node?.price);setOpenSideCart(false); }}
                  value={ele?.node?.id} >
                  {sizeMapping[ele?.node?.title]}
                </Button>
              ))}
            </Col>

          </Row> */}
          <div className='checkout-btn'>
           <Button className='mt-4' onClick={() => handleCheckout()}>Add to cart</Button> 
          </div>
          <p style={{ padding: "10px" }} dangerouslySetInnerHTML={{ __html: product?.node?.descriptionHtml }}></p>

        </Col>
      </Row>
      {loader ?
        <div className={loader ? 'parentDisable' : ''} width="100%">
          <div className='overlay-box'>
            <Spinner style={{ width: '2rem', height: '2rem', margin: '25% 50%' }} children={false} />
          </div>
        </div> : null}
    </div>
  );
}


const mapStateToProps = (state) => ({
  product: state.products?.product
});

const mapDispatchToProps = (dispatch) => ({
  fetchProductById: (id) => dispatch(fetchProductByIdSuccess(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);

