
import React, { useEffect, useState } from 'react';
import { Drawer, Divider } 
    from '@material-ui/core';
import { Button, Input, Spinner } from 'reactstrap';
import {checkoutLineItemsRemove, custQuery,checkoutLineItemsAdd,checkoutLineItemsUpdate,checkoutDiscountCodeApply,cartQuery,checkoutDiscountCodeRemove,cartLinesAdd,cartLinesUpdate,cartLinesRemove,createCheckout} from '../apis/gqlApi'
import { useMutation,useLazyQuery,useQuery } from '@apollo/client';
import { NotificationManager } from 'react-notifications';
import { Link, useNavigate } from 'react-router-dom';
import AddAddress from './AddAddress';

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
  
const SideCart =( { isOpen,toggle,checkoutData})=> {
 
  let navigate = useNavigate();
  const [data,setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [code,setCode] = useState();
  const [discount,setDiscount] = useState(0);
  const [checkoutLineItemsRemoveMutation] = useMutation(checkoutLineItemsRemove);
  const [checkoutLineItemsAddMutation] = useMutation(checkoutLineItemsAdd);
  const [checkoutLineItemsUpdateMutation] = useMutation(checkoutLineItemsUpdate);
  const [checkoutDiscountCodeApplyMutation] = useMutation(checkoutDiscountCodeApply);
  const [checkoutDiscountCodeRemoveMutation] = useMutation(checkoutDiscountCodeRemove);
  const [cartLinesAddMutation] = useMutation(  cartLinesAdd  );
  const [cartLinesUpdateMutation] = useMutation(  cartLinesUpdate  );
  const [cartLinesRemoveMutation] = useMutation(  cartLinesRemove  );
  const [createCheckoutMutation] = useMutation(createCheckout);
 // const [checkoutQuery,{ loading, error, data:checkout  } ] = useLazyQuery(checkQuery,{fetchPolicy: "network-only" });
  const [crtQuery,{ loading, error, data:cart  } ] = useLazyQuery(cartQuery,{fetchPolicy: "network-only" });
  const [customerQuery,{ loading:custLoading, error:custErr, data:custData  } ] = useLazyQuery(custQuery,{fetchPolicy: "network-only" });

  // const {loading:discountLoader, error:discountErr, data:discount} = useQuery(automaticDiscountNodes,{id:"gid://shopify/DiscountAutomaticNode/298192273430"},{fetchPolicy: "network-only" });

  useEffect(()=>{
    crtQuery( {
            variables: { id: localStorage.getItem("cartId") }
         });
    customerQuery( {
        variables: { customerAccessToken: localStorage.getItem("token") }
    });     
 },[])

  useEffect(()=>{
    console.log("cart=====",cart)
    calculateDiscount(cart?.cart)
    setData(cart?.cart)
   
  },[cart])

  useEffect(()=>{
    calculateDiscount(checkoutData)
    setData(checkoutData)
   
  },[checkoutData])

 


  const onRemove = (variantId)=>{

    cartLinesRemoveMutation({ variables: {cartId:localStorage.getItem("cartId"),lineIds:[variantId] }}).then(
      res => {
        calculateDiscount(res?.data?.checkoutLineItemsRemove?.checkout)
        setData(res?.data?.checkoutLineItemsRemove?.checkout)
        //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
      },
      err => {
        console.log('create checkout error', err);
      }
    );
  }

  const handleCheckout = () => {

    const address = custData?.customer?.defaultAddress;
    delete address?.__typename
    delete address?.id

    let lineItems = data?.lines?.edges?.map(e => ({ variantId: e?.node?.merchandise?.id, quantity: e?.node?.quantity }))
    let variables = { input: { lineItems: lineItems } };

    setLoader(true);

    createCheckoutMutation({ variables:{...variables,input:{...variables.input,email:data?.customer?.email,shippingAddress:{...address,firstName:custData?.customer?.firstName,lastName:custData?.customer?.lastName}}} }).then(
        res => {
          console.log(res);
          setLoader(false);
          localStorage.setItem("checkoutId",res?.data?.checkoutCreate?.checkout?.id)
          NotificationManager.success("Checkout created!", 'Success');
          navigate("/checkout",{ replace: true })
        },
        err => {
          console.log('create checkout error', err);
          setLoader(false);
        }
      );
  }

  const calculateDiscount = (checkout) => {
    let discount = 0;
    checkout?.lineItems?.edges.map((e)=>{
      e?.node?.discountAllocations.map((val)=>{
        console.log("val====",val)

        discount += Number(val?.allocatedAmount?.amount) 
      })
    })

    setDiscount(discount);
  }

  const handleApplyCode = () => {
    checkoutDiscountCodeApplyMutation({ variables: {checkoutId:localStorage.getItem("cartId"),discountCode:code }}).then(
      res => {
        console.log(res);
        setLoader(false);
        if(res?.data?.checkoutDiscountCodeApply?.userErrors.length){
          //setData(res?.data?.checkoutDiscountCodeApply?.userErrors[0]?.message)
         
          NotificationManager.error(res?.data?.checkoutDiscountCodeApply?.userErrors[0]?.message, 'Error')
        }else{
          calculateDiscount(res?.data?.checkoutDiscountCodeApply?.checkout);
          setData(res?.data?.checkoutDiscountCodeApply?.checkout)
          NotificationManager.success("Code applied!", 'Success')
        }
        
        //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
      },
      err => {
        console.log('create checkout error', err);
        setLoader(false);
      }
    );
    localStorage.setItem("code",code);  
    setCode("");
  }

  const removeDiscount = () => {
    checkoutDiscountCodeRemoveMutation({ variables: {checkoutId:localStorage.getItem("cartId") }}).then(
      res => {
        console.log(res);
        setLoader(false);
        if(res?.data?.checkoutDiscountCodeRemove?.checkoutUserErrors.length){
          //setData(res?.data?.checkoutDiscountCodeApply?.userErrors[0]?.message)
         
          NotificationManager.error(res?.data?.checkoutDiscountCodeRemove?.checkoutUserErrors[0]?.message, 'Error')
        }else{
          calculateDiscount(res?.data?.checkoutDiscountCodeRemove?.checkout);
          setData(res?.data?.checkoutDiscountCodeRemove?.checkout)
          NotificationManager.success("Code Removed!", 'Success')
        }
        
        //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
      },
      err => {
        console.log('create checkout error', err);
        setLoader(false);
      }
    );
    localStorage.removeItem("code",code);  

  }

  const onUpdateQuantity = (e,varianntId,index) => {

    setLoader(true);

    if(e.target.value === "+"){
      const lineItems = [{ merchandiseId: varianntId, quantity: 1 }]

      cartLinesAddMutation({ variables: {cartId:localStorage.getItem("cartId"),lines:lineItems }}).then(
        res => {
          console.log(res);
          setData(res?.data?.cartLinesAdd?.cart)
          setLoader(false);
          NotificationManager.success("Product added to cart!", 'Success')
          
        },
        err => {
          setLoader(false);
          console.log('create checkout error', err);
          
        }
      );
    }else{
      const {edges} = data?.lines
      let lineItems =[ ...edges]
      console.log(lineItems,lineItems[index]["node"]["quantity"],index)
      lineItems[index]["node"]["quantity"] = Number(lineItems[index]["node"]["quantity"]) - 1

      lineItems = lineItems.map((e)=>({id:e?.node?.id,merchandiseId:e?.node?.merchandise?.id,quantity:e?.node?.quantity}))

      cartLinesUpdateMutation({ variables: {cartId:localStorage.getItem("cartId"),lines:lineItems }}).then(
        res => {
          setLoader(false);
          calculateDiscount(res?.data?.checkoutLineItemsReplace?.checkout)
          setData(res?.data?.checkoutLineItemsReplace?.checkout)
          NotificationManager.success("Product removed from cart!", 'Success')
          //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
        },
        err => {
          console.log('create checkout error', err);
          setLoader(false);
        }
      );
    }
    
  }
  
    return (
    
        <Drawer
          open={isOpen}
          onClose={toggle}
        >
          <h4 className='text-center'>Cart</h4>
          {
            data?.lines?.edges.length ?
            data?.lines?.edges.map((ele,i)=>(
              <div className='cart-card' key={i}>
                <div>
                  <img src={ele?.node?.merchandise?.image?.url} width={100}/>
                </div>
                <div>
                  <p>{ele?.node?.merchandise?.product?.title}</p>
                  <div className='d-flex'>
                  {
                    ele?.node?.merchandise?.title.split(" / ")?.map((e,i)=>(
                      <p>{i === 0 && /\d/.test(e) ?"Size" : e === "Default Title" ? "Title" : "Color"}: {i === 0 && /\d/.test(e) ?sizeMapping[e] : e}</p>
                    ))
                  }</div>
                  
                  <div className='d-flex justify-content-around'>
                  <div>
                  <Button className='m-2' onClick={(e)=>onUpdateQuantity(e,ele?.node?.merchandise?.id,i)} disabled={ele?.node?.quantity === 1}>-</Button>
                      {ele?.node?.quantity}
                  <Button className='m-2' value={"+"} onClick={(e)=>onUpdateQuantity(e,ele?.node?.merchandise?.id,i)} >+</Button>
                  </div>
                  <Button onClick={()=>onRemove(ele?.node?.id)}>Remove</Button>
                  </div>
                  {/* <Button onClick={()=>onRemove(ele?.node?.id)}>Remove</Button> */}
                </div>
                <div>
                  <p>${ele?.node?.merchandise?.price}</p>
                </div>
              </div>
            )):
            <div className='cart-card'>
              <p className='text-center'>No Items added yet</p>
            </div>
          }
          {
            data?.lines?.edges.length ?
            <div className='text-center m-4' >
            <div className='d-flex justify-content-between'><div>Sub Total</div><div>{data?.estimatedCost?.subtotalAmount?.amount}</div></div>
            <div className='d-flex justify-content-between'><div>Total Tax</div><div>{data?.estimatedCost?.totalTaxAmount}</div></div>
            {discount ? <div className='d-flex justify-content-between'><div>Discount</div><div>{discount.toFixed(2)}</div></div>:null}
            {data?.availableShippingRates?.shippingRates?.length ? 
              data?.availableShippingRates?.shippingRates.map((e)=>(
                <div className='d-flex justify-content-between'><div>{e?.title}</div><div>{e?.price}</div></div>
              ))
              :null}
            <hr/>
            <div className='d-flex justify-content-between'><div>Total</div><div>{data?.estimatedCost?.totalAmount?.amount}</div></div>
            {/* {data?.discountApplications?.edges.length
            ? */}
            {/* <div className='pt-2'><Link to={"/profile"}>Update Default/shipping address or contact information</Link></div> */}

            {/* <div className='pt-2'><Button>Add Shipping Address</Button></div> */}
             {/* <div className='d-flex justify-content-around mt-5'>
              <div><Input type='text' value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Enter code"/></div>
              <div><Button className='m-0' onClick={()=>handleApplyCode()}>Apply</Button></div>
              
              </div> */}
              {/* {discount && localStorage.getItem("code") ?
              <div className='discount'>{localStorage.getItem("code")} <i class="fa fa-window-close" aria-hidden="true" onClick={()=>removeDiscount()}></i>
              </div>
            : null} */}
              {/* :null} */}
            <Button className='m-4' onClick={()=>handleCheckout(data?.webUrl)}>Checkout</Button>
          </div>
            : null
          }

          {loader ?
        <div className={loader ? 'parentDisable' : ''} width="100%">
          <div className='overlay-box'>
            <Spinner style={{ width: '2rem', height: '2rem', margin: '25% 50%' }} children={false} />
          </div>
        </div> : null}

        </Drawer>
    );
  
}

export default SideCart;