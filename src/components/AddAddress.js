import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {customerAddressCreate,customerAddressUpdate,checkoutShippingAddressUpdate} from "./../apis/gqlApi"

const AddAddress = ({loading,error,data,isOpen,toggle,customerQuery,isShippingAddress }) => {

    const [inputs, setInputs] = useState({
        address1:"",
        address2:"",
        city:"",
        company:"",
        country:"",
        province:"",
        zip:""
        });
    const [inputErr, setInputErr] = useState({})


    useEffect(() => {
        console.log("data===",data)
        if (Object.entries(data).length) {
            const cust = { ...data }
            setInputs({ ...cust })
        }else{
            setInputs({
                address1:"",
                address2:"",
                city:"",
                company:"",
                country:"",
                province:"",
                zip:""
              })
        }

    }, [data])

    const [customerAddressCreateMutation] = useMutation(customerAddressCreate);
    const [customerAddressUpdateMutation] = useMutation(customerAddressUpdate);
    const [checkoutShippingAddressUpdateMutation] = useMutation(checkoutShippingAddressUpdate);
    

    const validate = () => {
        let localErr = {};
        setInputErr({});

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
            console.log("check===",localErr)
            if(!Object.entries(localErr)?.length){
            const localInput = { ...inputs }
            
            let variables = {
                address: {...localInput}, customerAccessToken: localStorage.getItem("token")
            };

            //if(isShippingAddress){
                
            // }else{
                if(Object.entries(data).length){
                    variables = {
                        address: {
                            address1: localInput?.address1,
                            address2: localInput?.address2,
                            city: localInput?.city,
                            company: localInput?.company,
                            country: localInput?.country,
                            province: localInput?.province,
                            zip: localInput?.zip
                        },
                        customerAccessToken: localStorage.getItem("token"),
                        id:localInput?.id
                    };
                    delete variables?.address?.id;
    
                    customerAddressUpdateMutation({ variables }).then(
                        res => {
                            if (res?.data?.customerAddressUpdate?.customerUserErrors.length) {
                                console.log(res?.data?.customerAddressUpdate?.customerUserErrors[0]?.message)
                                NotificationManager.error(res?.data?.customerAddressUpdate?.customerUserErrors[0]?.message, 'Error')
                            } else {
                                setInputs({
                                    address1:"",
                                    address2:"",
                                    city:"",
                                    company:"",
                                    country:"",
                                    province:"",
                                    zip:""
                                    });
                                    customerQuery( {
                                        variables: { customerAccessToken: localStorage.getItem("token") }
                                     });    
                                toggle();
                                NotificationManager.success('Address updated successfully!!', 'Success')
                            }
                        },
                        err => {
                            console.log('update customer error', err);
                            NotificationManager.error(err?.message, 'Error')
                        }
                    );
                }else{
                    customerAddressCreateMutation({ variables }).then(
                        res => {
                            if (res?.data?.customerAddressCreate?.customerUserErrors.length) {
                                console.log(res?.data?.customerAddressCreate?.customerUserErrors[0]?.message)
                                NotificationManager.error(res?.data?.customerAddressCreate?.customerUserErrors[0]?.message, 'Error')
                            } else {
                                setInputs({
                                    address1:"",
                                    address2:"",
                                    city:"",
                                    company:"",
                                    country:"",
                                    province:"",
                                    zip:""
                                    });
                                    customerQuery( {
                                        variables: { customerAccessToken: localStorage.getItem("token") }
                                     });
                                toggle();    
                                NotificationManager.success('Address created successfully!!', 'Success')
                            }
                        },
                        err => {
                            console.log('update customer error', err);
                            NotificationManager.error(err?.message, 'Error')
                        }
                    );
                }}
            // }

            
            
    }

    return (<>
        <Modal isOpen={isOpen} toggle={()=>toggle()} >
        <ModalHeader toggle={()=>toggle()}>Address</ModalHeader>
            {/* <Header /> */}
            <div className='m-4'>
                {loading ? <h3>Loading... </h3>
                    :<Form>
                        <FormGroup>
                            <Label for="address1">Address1</Label>
                            <Input type="text" name="address1" id="address1" placeholder="Address 1" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.address1} invalid={inputErr.hasOwnProperty('address1')}/>
                            <FormFeedback>{inputErr?.address1}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address2">Address2</Label>
                            <Input type="text" name="address2" id="address1" placeholder="Address 2" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.address2} invalid={inputErr.hasOwnProperty('address2')}/>
                            <FormFeedback>{inputErr?.address2}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="city">City</Label>
                            <Input type="text" name="city" id="city" placeholder="City" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.city} invalid={inputErr.hasOwnProperty('city')}/>
                            <FormFeedback>{inputErr?.city}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="company">Company</Label>
                            <Input type="text" name="company" id="company" placeholder="Company" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.company} invalid={inputErr.hasOwnProperty('company')}/>
                            <FormFeedback>{inputErr?.company}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="country">Country</Label>
                            <Input type="text" name="country" id="country" placeholder="Country" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.country} invalid={inputErr.hasOwnProperty('country')}/>
                            <FormFeedback>{inputErr?.country}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="province">Province</Label>
                            <Input type="text" name="province" id="province" placeholder="Province" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.province} invalid={inputErr.hasOwnProperty('province')}/>
                            <FormFeedback>{inputErr?.province}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="zip">Zip</Label>
                            <Input type="text" name="zip" id="zip" placeholder="Zip" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.zip} invalid={inputErr.hasOwnProperty('zip')}/>
                            <FormFeedback>{inputErr?.zip}</FormFeedback>
                        </FormGroup>
                        
                        <Button onClick={() => { onSubmit() }}>Save</Button>
                    </Form>}
            </div></Modal></>);
}

export default AddAddress;