import React, { useEffect, useState } from "react";
import "./../App.scss";
import { Button, Form, FormFeedback, FormGroup, Input } from "reactstrap";
import {checkoutShippingAddressUpdate,checkoutEmailUpdate} from "./../apis/gqlApi";
import { NotificationManager } from 'react-notifications';
import { useMutation} from '@apollo/client';


const errObj = {
    email: "Please enter valid email",
    password: "Password length must be 8 and must have include letters,digits and special characters",
    phone: "phone number should be of 10 digits"
}

const LeftCheckout = ({checkoutData}) => {

    const [inputs, setInputs] = useState({
        email:"",
        firstName:"",
        lastName:"",
        phone:"",
        address1:"",
        address2:"",
        city:"",
        company:"",
        country:"",
        province:"",
        zip:""
        });
    const [inputErr, setInputErr] = useState({});
    const [checkoutShippingAddressUpdateMutation] = useMutation(checkoutShippingAddressUpdate);
    const [ccheckoutEmailUpdateMutation] = useMutation(checkoutEmailUpdate);
    
    useEffect(()=>{

        if(checkoutData?.shippingAddress || checkoutData?.email){
            setInputs({...checkoutData?.shippingAddress,email:checkoutData?.email,firstName:checkoutData?.shippingAddress?.name.split(" ")[0],lastName:checkoutData?.shippingAddress?.name.split(" ")[1]})
        }

    },[checkoutData])

    const validate = () => {
        let localErr = {};
        setInputErr({});

        const { email, phone } = inputs;


        if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            localErr = { ...localErr, email: errObj['email'] }
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            localErr = { ...localErr, phone: errObj['phone'] }
        }

        Object.entries(inputs)?.map((ele)=>{
            console.log("check===",ele[1] === "",ele[1].length)
            if(ele[1] === ""){
                localErr={...localErr,[ele[0]]:`${ele[0]} is required`}
            }
        })


        setInputErr({...localErr});
        return localErr;
    }

    const onSubmit = () => {

        const localErr = validate();
        console.log("localErr====",localErr)
        if(!Object.entries(localErr)?.length){
        const localInput = { ...inputs }

        delete localInput.email;
        
        let variables = {
            checkoutId:localStorage.getItem("checkoutId"),
            shippingAddress: {...localInput}, 
        };

        ccheckoutEmailUpdateMutation({variables:{
            checkoutId:localStorage.getItem("checkoutId"),
            email: inputs?.email, 
        }}).then((res)=>{
            
        })

        checkoutShippingAddressUpdateMutation({ variables }).then(
            res => {
                if (res?.data?.checkoutShippingAddressUpdate?.customerUserErrors.length) {
                    console.log(res?.data?.checkoutShippingAddressUpdate?.customerUserErrors[0]?.message)
                    NotificationManager.error(res?.data?.checkoutShippingAddressUpdate?.customerUserErrors[0]?.message, 'Error')
                } else {
                    setInputs({
                        email:"",
                        firstName:"",
                        lastName:"",
                        phone:"",
                        address1:"",
                        address2:"",
                        city:"",
                        company:"",
                        country:"",
                        province:"",
                        zip:""
                        });
                         
                    NotificationManager.success('shipping address added successfully!!', 'Success')
                }
            },
            err => {
                console.log('update customer error', err);
                NotificationManager.error(err?.message, 'Error')
            }
        );
        }
                
}

    return (
        <div className="left-checkout">
            <h5>Customer contact details</h5>

            <Form className="shipping-form">
                <FormGroup>
                    <Input type="email" name="email" id="email" placeholder="Email" value={inputs?.email} invalid={inputErr.hasOwnProperty('email')} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.email}</FormFeedback>
                </FormGroup>
                <div className="sub-form">
                <FormGroup className="m-1">
                    <Input type="text" name="firstName" id="firstName" placeholder="FirstName" value={inputs?.firstName} invalid={inputErr.hasOwnProperty('FirstName')} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.firstName}</FormFeedback>
                </FormGroup>
                <FormGroup className="m-1">
                    <Input type="text" name="lastName" id="lastName" placeholder="LastName" value={inputs?.lastName} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} />
                    <FormFeedback>{inputErr?.lastName}</FormFeedback>
                </FormGroup>
                </div>
                <FormGroup>
                    <Input type="text" name="address1" id="address1" placeholder="Address" value={inputs?.address1} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.address1}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Input type="text" name="address2" id="address2" placeholder="Apartment,society etc" value={inputs?.address2} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.address2}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Input type="text" name="company" id="company" placeholder="Company" value={inputs?.company} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.company}</FormFeedback>
                </FormGroup>
                <div className="sub-form">
                <FormGroup className="m-1">
                    <Input type="text" name="city" id="city" placeholder="City" value={inputs?.city} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.city}</FormFeedback>
                </FormGroup>
                <FormGroup className="m-1">
                    <Input type="text" name="province" id="province" placeholder="State" value={inputs?.province} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.province}</FormFeedback>
                </FormGroup>
                <FormGroup className="m-1">
                    <Input type="text" name="country" id="country" placeholder="Country" value={inputs?.country} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.country}</FormFeedback>
                </FormGroup>
                </div>
                <div className="sub-form">
                <FormGroup className="m-1">
                    <Input type="number" name="zip" id="zip" placeholder="Zipcode" value={inputs?.zip} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.zip}</FormFeedback>
                </FormGroup>
                <FormGroup className="m-1">
                    <Input type="number" name="phone" id="phone" placeholder="Phone" value={inputs?.phone} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}/>
                    <FormFeedback>{inputErr?.phone}</FormFeedback>
                </FormGroup>
                </div>
            </Form>
            <Button onClick={()=>onSubmit()}>Submit</Button>

        </div>
    )
}

export default LeftCheckout;