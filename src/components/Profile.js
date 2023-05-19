import { useMutation, useQuery } from '@apollo/react-hooks';
import {customerUpdate} from "./../apis/gqlApi";
import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { NotificationManager } from 'react-notifications';

const errObj = {
    email: "Please enter valid email",
    password: "Password length must be 8 and must have include letters,digits and special characters",
    phone: "phone number should be of 10 digits"
}

const Profile = ({loading,error,data}) => {

    const [inputs, setInputs] = useState({});
    const [inputErr, setInputErr] = useState({})

    useEffect(() => {
        if (data?.customer) {
            const cust = { ...data?.customer }
            delete cust?.phone
            setInputs({ ...cust, phone: data?.customer?.phone?.slice(3, data?.customer?.phone?.length) })
        }

    }, [data])

    useEffect(() => {
        setInputErr(error || {})
    }, [error])

    const [customerUpdateMutation] = useMutation(customerUpdate);

    const validate = () => {
        const { email, phone, password } = inputs;
        let localErr = {}

        setInputErr({})

        if (!email) {
            localErr = { ...localErr, email: "Email is required" }
        }

        if (email || phone) {

            if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                localErr = { ...localErr, email: errObj['email'] }
            }

            if (password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
                localErr = { ...localErr, password: errObj['password'] }
            }

            if (phone && !/^\d{10}$/.test(phone)) {
                localErr = { ...localErr, phone: errObj['phone'] }
            }
        }
        setInputErr(localErr)
        return localErr;
    }

    const onSubmit = () => {

        const localErr = validate();
        console.log("check", localErr)
        if (Object.entries(localErr).length) {
            return false;
        } else {
            const localInput = { ...inputs }
            delete localInput["phone"]
            const variables = {
                customer: {
                    firstName: localInput?.firstName,
                    lastName: localInput?.lastName,
                    email: localInput?.email,
                    acceptsMarketing: localInput?.acceptsMarketing,
                    'phone': `+91${inputs.phone}`
                }, customerAccessToken: localStorage.getItem("token")
            };
            customerUpdateMutation({ variables }).then(
                res => {
                    if (res?.data?.customerUpdate?.customerUserErrors.length) {
                        console.log(res?.data?.customerUpdate?.customerUserErrors[0]?.message)
                        NotificationManager.error(res?.data?.customerUpdate?.customerUserErrors[0]?.message, 'Error')
                    } else {
                        NotificationManager.success('Profile updated successfully!!', 'Success')
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
        <>
            {/* <Header /> */}
            <div className='register-wrp'>
                <h1>Profile</h1>
                {loading ? <h3>Loading... </h3>
                    :<Form>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" name="firstName" id="firstName" placeholder="First Name" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.firstName} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" name="lastName" id="lastName" placeholder="Last Name" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.lastName} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone">Phone Number</Label>
                            <Input type="number" name="phone" id="phone" placeholder="Phone Number" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.phone} invalid={inputErr.hasOwnProperty('phone')} />
                            <FormFeedback>{inputErr?.phone}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="Email" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.email} invalid={inputErr.hasOwnProperty('email')} />
                            <FormFeedback>{inputErr?.email}</FormFeedback>
                        </FormGroup>
                        {/* <FormGroup>
                <Input type="password" name="password" id="examplePassword" placeholder="Password" onChange={(e)=>setInputs({...inputs,[e.target.name]:e.target.value})} value={inputs?.password} invalid={inputErr.hasOwnProperty('password')} />
                <FormFeedback>{inputErr?.password}</FormFeedback>
            </FormGroup> */}
                        <FormGroup tag="fieldset">
                            <Label>Accepts Marketing</Label>
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="acceptsMarketing" value={true} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value === "true" })} checked={inputs?.acceptsMarketing === true} />{' '}
                                    yes
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="acceptsMarketing" value={false} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value === "true" })} checked={inputs?.acceptsMarketing === false} />{' '}
                                    No
                                </Label>
                            </FormGroup>
                        </FormGroup>
                        <Button onClick={() => { onSubmit() }}>Update</Button>

                    </Form>}
            </div></>);
}

export default Profile;