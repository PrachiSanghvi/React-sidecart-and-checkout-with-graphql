import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./../App.scss";
import LeftCheckout from "./LeftCheckout";
import RightCheckout from "./RightCheckout";
import {checkQuery} from '../apis/gqlApi'
import { useLazyQuery } from "@apollo/react-hooks";
import { Spinner } from "reactstrap";

const Checkout = ()=>{

    const [checkoutData,setCheckoutData] = useState({});
    const [discocunt,setDiscount] = useState();
    const [loader,setLoader] = useState(false);
    const [checkoutQuery,{ loading, error, data:checkout  } ] = useLazyQuery(checkQuery,{fetchPolicy: "network-only" });


    useEffect(()=>{
        checkoutQuery({variables:{id:localStorage.getItem("checkoutId")}}).then((res)=>{
            setCheckoutData(res?.data?.node)
            calculateDiscount(res?.data?.node)
        }).catch((e)=>{
            console.log(e);
        })
    },[checkout])

    const calculateDiscount = (checkout) => {
        let discount = 0;
        checkout?.lineItems?.edges.map((e)=>{
          e?.node?.discountAllocations.map((val)=>{
            discount += Number(val?.allocatedAmount?.amount) 
          })
        })
        console.log("checkout====",discount);

        setDiscount(discount)
      }

    return (
        <div className="App">
            <Header/>
            {(loading || loader) ?
            <div className={loading? 'parentDisable' : ''} width="100%">
            <div className='overlay-box'/>    
            <Spinner style={{ width: '2rem', height: '2rem',margin:'0%' }} children={false} />
            </div>:null}
            <div className="checkout">
                <LeftCheckout checkoutData={checkoutData}/>
                <RightCheckout
                 checkoutData={checkoutData} 
                 discount={discocunt}
                 calculateDiscount={calculateDiscount} 
                 setCheckoutData={setCheckoutData}
                 loader={loader}
                 setLoader={setLoader}/>
            </div>
            
        </div>
    )
}

export default Checkout;