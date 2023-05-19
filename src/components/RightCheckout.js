import React, { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import {checkoutDiscountCodeApply,checkoutDiscountCodeRemove} from './../apis/gqlApi'
import "./../App.scss";
import { NotificationManager } from 'react-notifications';
import { useMutation} from '@apollo/client';

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


const RightCheckout = ({checkoutData,discount,calculateDiscount,setCheckoutData,setLoader})=>{

    const [code,setCode] = useState();
    const [checkoutDiscountCodeApplyMutation] = useMutation(checkoutDiscountCodeApply);
    const [checkoutDiscountCodeRemoveMutation] = useMutation(checkoutDiscountCodeRemove);

    const applyDiscount = () => {

        if(code){
            setLoader(true);
            checkoutDiscountCodeApplyMutation({ variables: {checkoutId:localStorage.getItem("checkoutId"),discountCode:code }}).then(
                res => {
                  console.log(res);
                  setLoader(false);
                  if(res?.data?.checkoutDiscountCodeApply?.userErrors.length){
                    //setData(res?.data?.checkoutDiscountCodeApply?.userErrors[0]?.message)
                   
                    NotificationManager.error(res?.data?.checkoutDiscountCodeApply?.userErrors[0]?.message, 'Error')
                  }else{
                    calculateDiscount(res?.data?.checkoutDiscountCodeApply?.checkout);
                    setCheckoutData(res?.data?.checkoutDiscountCodeApply?.checkout)
                    NotificationManager.success("Code applied!", 'Success')
                  }
                  
                  //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
                },
                err => {
                  console.log('create checkout error', err);
                  setLoader(false);
                }
              );
              localStorage.setItem("discount",code);  
              setCode("");
        }

    }

    const removeCode = () =>{
        checkoutDiscountCodeRemoveMutation({ variables: {checkoutId:localStorage.getItem("checkoutId") }}).then(
            res => {
              console.log(res);
              setLoader(false);
              if(res?.data?.checkoutDiscountCodeRemove?.checkoutUserErrors.length){
                //setData(res?.data?.checkoutDiscountCodeApply?.userErrors[0]?.message)
               
                NotificationManager.error(res?.data?.checkoutDiscountCodeRemove?.checkoutUserErrors[0]?.message, 'Error')
              }else{
                calculateDiscount(res?.data?.checkoutDiscountCodeRemove?.checkout);
                setCheckoutData(res?.data?.checkoutDiscountCodeRemove?.checkout)
                NotificationManager.success("Code Removed!", 'Success')
              }
              
              //window.open(res?.data?.checkoutCreate?.checkout?.webUrl)
            },
            err => {
              console.log('create checkout error', err);
              setLoader(false);
            }
          );
          
        localStorage.removeItem("discount");
    }

    return (
        <div className="right-checkout">
            <h5>Product detail</h5>
            {
                checkoutData?.lineItems?.edges.map((ele,i)=>(
                <div className="product-checkout" key={i}>
                        <div style={{width:"15%"}}><img src={ele?.node?.variant?.image?.src} width={"100%"}/></div>
                    <div>
                        <h6>{ele?.node?.title}</h6>
                        <h6>variant type: {sizeMapping[ele?.node?.variant?.title]}</h6>
                    </div>
                    <div>
                        <h6>{ele?.node?.variant?.price}</h6>
                        <h6>Quantity: {ele?.node?.quantity}</h6>
                    </div>
                </div>
                ))
            }
            
            <div className="hr-checkout"><hr/></div>
            <div className="discount-checkout">
                <Input type="text" placeholder="Discount code" value={code} onChange={(e)=>setCode(e.target.value)}/>
                <Button onClick={()=>applyDiscount()}>Apply</Button>
            </div>
            {discount && localStorage.getItem("discount") ? <div className="discount-tag">{localStorage.getItem("discount")} <i class="fa fa-times" aria-hidden="true" onClick={()=>removeCode()}></i></div> : null}
            <div className="hr-checkout"><hr/></div>
            <div className="discocunt-price">
                <div>Subtotal</div>
                <div>{checkoutData?.lineItemsSubtotalPrice?.amount}</div>
            </div>
            <div className="discocunt-price">
                <div>TotalTax</div>
                <div>{checkoutData?.totalTax}</div>
            </div>
           {discount ? <div className="discocunt-price">
                <div>Discount</div>
                <div>{discount.toFixed(2)}</div>
            </div>:null}
            <div className="hr-checkout"><hr/></div>
            <div className="discocunt-price">
                <div>Total</div>
                <div>{checkoutData?.totalPrice}</div>
            </div>
        </div>
    )
}

export default RightCheckout;