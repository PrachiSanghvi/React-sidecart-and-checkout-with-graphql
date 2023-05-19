import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Spinner } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddAddress from './AddAddress';
import AddressCard from './AddressCard';
import "./../App.scss"
import {isEqual} from "lodash"
import {customerAddressDelete,customerDefaultAddressUpdate,checkoutShippingAddressUpdate} from "./../apis/gqlApi"

const Address = ({ loading, error, data,customerQuery  }) => {
    const [modal, setModal] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [defaultAddress,setDefaultAddressObj] = useState({});
    const [editData, setEditData] = useState({});
    const [removeLoader,setRemoveLoader] = useState(false);
    const [defaultLoader,setDefaultLoader] = useState(false);
    const [checkoutShippingAddressUpdateMutation] = useMutation(checkoutShippingAddressUpdate);

    useEffect(() => {

        setRemoveLoader(false);
        setDefaultLoader(false);
        setAddresses(data?.customer?.addresses?.edges || []);
        
    }, [data])

    useEffect(()=>{
        let address = {...data?.customer?.defaultAddress};
        delete address?.__typename
        delete address?.id

        if(!isEqual(defaultAddress,{...address,firstName:data?.customer?.firstName,lastName:data?.customer?.lastName}) ){

               

        setDefaultAddressObj({...address,firstName:data?.customer?.firstName,lastName:data?.customer?.lastName})      

        // checkoutShippingAddressUpdateMutation({ variables :{checkoutId:localStorage.getItem("cartId") ,
        //         shippingAddress:{...address,firstName:data?.customer?.firstName,lastName:data?.customer?.lastName}}}).then(
        //             res => {
        //                 if (res?.data?.checkoutShippingAddressUpdate?.checkoutUserErrors.length) {
        //                     console.log(res?.data?.checkoutShippingAddressUpdate?.checkoutUserErrors[0]?.message)
        //                     NotificationManager.error(res?.data?.checkoutShippingAddressUpdate?.checkoutUserErrors[0]?.message, 'Error')
        //                 } else {  
        //                     //NotificationManager.success('Shipping address added successfully!!', 'Success')
        //                 }
        //             },
        //             err => {
        //                 console.log('update customer error', err);
        //                 NotificationManager.error(err?.message, 'Error')
        //             }
        //         );
        }
        

    },[data?.customer?.defaultAddress,data?.customer?.firstName,data?.customer?.lastName])

    const [customerAddressDeleteMutation] = useMutation(customerAddressDelete);
    const [customerDefaultAddressUpdateMutation] = useMutation(customerDefaultAddressUpdate);

    const onRemove = (id) => {

        setRemoveLoader(true);
        const variables = {
            customerAccessToken: localStorage.getItem("token"), id: id
        };

        
        customerAddressDeleteMutation({ variables }).then(
            res => {
                if (res?.data?.customerAddressDelete?.customerUserErrors.length) {
                    console.log(res?.data?.customerAddressDelete?.customerUserErrors[0]?.message)
                    NotificationManager.error(res?.data?.customerAddressDelete?.customerUserErrors[0]?.message, 'Error')
                } else {

                    customerQuery( {
                        variables: { customerAccessToken: localStorage.getItem("token") }
                     })
                    NotificationManager.success('Address deleted successfully!!', 'Success')
                }
                
            },
            err => {
                setRemoveLoader(false);
                console.log('customerAddressDelete error', err);
                NotificationManager.error(err?.message, 'Error')
            }
        );
       
    }

    const setDefaultAddress = (id) => {

        setDefaultLoader(true);
        const variables = {
            customerAccessToken: localStorage.getItem("token"), addressId: id
        };

        customerDefaultAddressUpdateMutation({ variables }).then(
            res => {
                if (res?.data?.customerDefaultAddressUpdate?.customerUserErrors.length) {
                    console.log(res?.data?.customerDefaultAddressUpdate?.customerUserErrors[0]?.message)
                    NotificationManager.error(res?.data?.customerDefaultAddressUpdate?.customerUserErrors[0]?.message, 'Error')
                } else {
                    customerQuery( {
                        variables: { customerAccessToken: localStorage.getItem("token") }
                     })
                    NotificationManager.success('Address set as default successfully!!', 'Success')
                }
            },
            err => {
                setDefaultLoader(false);
                console.log('customerAddressDelete error', err);
                NotificationManager.error(err?.message, 'Error')
            }
        );
    }

    const toggle = () => {
        setModal(!modal);
    }

   
    return (
        <div className='text-center m-2'>
            <Button className='m-4' onClick={() =>{ setEditData({});toggle();}}>Add Address</Button>
            <Row>
            {(addresses || [])?.map((ele, i) => (
                <AddressCard
                    id={ele?.node?.id}
                    address1={ele?.node?.address1}
                    address2={ele?.node?.address2}
                    city={ele?.node?.city}
                    company={ele?.node?.company}
                    country={ele?.node?.country}
                    province={ele?.node?.province}
                    zip={ele?.node?.zip}
                    isDefault={data?.customer?.defaultAddress && Object.entries(data?.customer?.defaultAddress).length &&  data?.customer?.defaultAddress?.id === ele?.node?.id ? true : false}
                    onRemove={onRemove}
                    toggle={toggle} 
                    setEditData={setEditData}
                    setDefaultAddress={setDefaultAddress}/>
            ))}
            </Row> 
            {removeLoader || defaultLoader ?
            <div className={removeLoader || defaultLoader ? 'parentDisable' : ''} width="100%">
            <div className='overlay-box'>    
            <Spinner style={{ width: '2rem', height: '2rem',margin:'15%' }} children={false} />
            </div>
            </div> : null} 
            
            <AddAddress isOpen={modal} toggle={toggle} loading={loading} error={error} data={editData} customerQuery={customerQuery}/>
        </div>);
}

export default Address;