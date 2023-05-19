
import React, { useEffect, useState } from 'react';
import { Drawer, Divider } 
    from '@material-ui/core';
import { Button, Input, Spinner } from 'reactstrap';
import {checkoutLineItemsRemove, checkoutLineItemsAdd,checkoutLineItemsUpdate,checkQuery,checkoutDiscountCodeApply,cartQuery,checkoutDiscountCodeRemove} from './../apis/gqlApi'
import { useMutation,useLazyQuery,useQuery } from '@apollo/client';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
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
 
  const [data,setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [code,setCode] = useState();
  const [discount,setDiscount] = useState(0);
  const [checkoutLineItemsRemoveMutation] = useMutation(checkoutLineItemsRemove);
  const [checkoutLineItemsAddMutation] = useMutation(checkoutLineItemsAdd);
  const [checkoutLineItemsUpdateMutation] = useMutation(checkoutLineItemsUpdate);
  const [checkoutDiscountCodeApplyMutation] = useMutation(checkoutDiscountCodeApply);
  const [checkoutDiscountCodeRemoveMutation] = useMutation(checkoutDiscountCodeRemove);
 // const [checkoutQuery,{ loading, error, data:checkout  } ] = useLazyQuery(checkQuery,{fetchPolicy: "network-only" });
  const [crtQuery,{ loading, error, data:cart  } ] = useLazyQuery(cartQuery,{fetchPolicy: "network-only" });


  // const {loading:discountLoader, error:discountErr, data:discount} = useQuery(automaticDiscountNodes,{id:"gid://shopify/DiscountAutomaticNode/298192273430"},{fetchPolicy: "network-only" });

  useEffect(()=>{
    crtQuery( {
            variables: { id: localStorage.getItem("cartId") }
         });
 },[])

  useEffect(()=>{
    calculateDiscount(cart)
    setData(cart)
   
  },[cart])

  useEffect(()=>{
    calculateDiscount(checkoutData)
    setData(checkoutData)
   
  },[checkoutData])

 


  const onRemove = (variantId)=>{

    checkoutLineItemsRemoveMutation({ variables: {checkoutId:localStorage.getItem("cartId"),lineItemIds:[variantId] }}).then(
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

  const handleCheckout = (url) => {

    // const variables = {
    //   "basicCodeDiscount": {
    //     "appliesOncePerCustomer": true,
    //     "code": "SHRTEST",
    //     "customerGets": {
    //       "appliesOnOneTimePurchase": true,
    //       "appliesOnSubscription": false,
    //       "items": {
    //         "all": true,            
    //       },
    //       "value": {
    //         "discountAmount": {
    //           "amount": 10,
    //           "appliesOnEachItem": true
    //         },
    //       }
    //     },
    //     "customerSelection": {
    //       "all": true,
    //     },
    //     "recurringCycleLimit": 1,
    //     "startsAt": "2022-01-01",
    //     "endsAt":"2022-012-012",
    //     "title": "test code",
    //     "usageLimit": 1
    //   }
    // }

    // setLoader(true);

    // discountCodeBasicCreateMutation({ variables:variables }).then(
    //   res => {
    //     console.log(res);
    //     setLoader(false);
    //     if(res?.data?.iscountCodeBasicCreate?.userErrors.length){
    //       //setData(res?.data?.checkoutDiscountCodeApply?.userErrors[0]?.message)
         
    //       NotificationManager.error(res?.data?.iscountCodeBasicCreate?.userErrors[0]?.message, 'Error')
    //     }else{
          
    //       NotificationManager.success("Code applied!", 'Success')
    //     }
        
    //     //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
    //   },
    //   err => {
    //     console.log('create checkout error', err);
    //     setLoader(false);
    //   }
    // );
    window.open(url)
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
      const lineItems = [{ variantId: varianntId, quantity: 1 }]

      checkoutLineItemsAddMutation({ variables: {checkoutId:localStorage.getItem("cartId"),lineItems:lineItems }}).then(
        res => {
          console.log(res);
          setLoader(false);
          calculateDiscount(res?.data?.checkoutLineItemsAdd?.checkout);
          setData(res?.data?.checkoutLineItemsAdd?.checkout)
          NotificationManager.success("Product added to cart!", 'Success')
          //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
        },
        err => {
          console.log('create checkout error', err);
          setLoader(false);
        }
      );
    }else{
      const {edges} = data?.lineItems
      let lineItems =[ ...edges]
      console.log(lineItems,lineItems[index]["node"]["quantity"],index)
      lineItems[index]["node"]["quantity"] = Number(lineItems[index]["node"]["quantity"]) - 1

      lineItems = lineItems.map((e)=>({variantId:e?.node?.variant?.id,quantity:e?.node?.quantity}))

      checkoutLineItemsUpdateMutation({ variables: {checkoutId:localStorage.getItem("cartId"),lineItems:lineItems }}).then(
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
            data?.lineItems?.edges.length ?
            data?.lineItems?.edges.map((ele,i)=>(
              <div className='cart-card' key={i}>
                <div>
                  <img src={ele?.node?.variant?.image?.src} width={100}/>
                </div>
                <div>
                  <p>{ele?.node?.title}</p>
                  <div className='d-flex'>
                  {
                    ele?.node?.variant?.title.split(" / ")?.map((e,i)=>(
                      <p>{i === 0 && /\d/.test(e) ?"Size" : e === "Default Title" ? "Title" : "Color"}: {i === 0 && /\d/.test(e) ?sizeMapping[e] : e}</p>
                    ))
                  }</div>
                  
                  <div className='d-flex justify-content-around'>
                  <div>
                  <Button className='m-2' onClick={(e)=>onUpdateQuantity(e,ele?.node?.variant?.id,i)} disabled={ele?.node?.quantity === 1}>-</Button>
                      {ele?.node?.quantity}
                  <Button className='m-2' value={"+"} onClick={(e)=>onUpdateQuantity(e,ele?.node?.variant?.id,i)} >+</Button>
                  </div>
                  <Button onClick={()=>onRemove(ele?.node?.id)}>Remove</Button>
                  </div>
                  {/* <Button onClick={()=>onRemove(ele?.node?.id)}>Remove</Button> */}
                </div>
                <div>
                  <p>${ele?.node?.variant?.price}</p>
                </div>
              </div>
            )):
            <div className='cart-card'>
              <p className='text-center'>No Items added yet</p>
            </div>
          }
          {
            data?.lineItems?.edges.length ?
            <div className='text-center m-4' >
            <div className='d-flex justify-content-between'><div>Sub Total</div><div>{data?.lineItemsSubtotalPrice?.amount}</div></div>
            <div className='d-flex justify-content-between'><div>Total Tax</div><div>{data?.totalTax}</div></div>
            {discount ? <div className='d-flex justify-content-between'><div>Discount</div><div>{discount.toFixed(2)}</div></div>:null}
            {data?.availableShippingRates?.shippingRates?.length ? 
              data?.availableShippingRates?.shippingRates.map((e)=>(
                <div className='d-flex justify-content-between'><div>{e?.title}</div><div>{e?.price}</div></div>
              ))
              :null}
            <hr/>
            <div className='d-flex justify-content-between'><div>Total</div><div>{data?.totalPrice}</div></div>
            {/* {data?.discountApplications?.edges.length
            ? */}
            <div className='pt-2'><Link to={"/profile"}>Update Default/shipping address or contact information</Link></div>

            {/* <div className='pt-2'><Button>Add Shipping Address</Button></div> */}
             <div className='d-flex justify-content-around mt-5'>
              <div><Input type='text' value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Enter code"/></div>
              <div><Button className='m-0' onClick={()=>handleApplyCode()}>Apply</Button></div>
              
              </div>
              {discount && localStorage.getItem("code") ?
              <div className='discount'>{localStorage.getItem("code")} <i class="fa fa-window-close" aria-hidden="true" onClick={()=>removeDiscount()}></i>
              </div>
            : null}
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