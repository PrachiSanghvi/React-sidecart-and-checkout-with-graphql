import { useMutation } from '@apollo/react-hooks';
import {customerCreate} from './../apis/gqlApi';
import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';

const errObj = {
    email: "Please enter valid email",
    password: "Password length must be 8 and must have include letters,digits and special characters",
    phone: "phone number should be of 10 digits"
}

const Register = () => {

    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        acceptsMarketing: false
    });
    const [inputErr, setInputErr] = useState({})
    const [customerCreateMutation] = useMutation(customerCreate);

    let navigate = useNavigate();


    const validate = () => {
        const { email, phone, password } = inputs;
        let localErr = {}

        setInputErr({})

        if (!email) {
            localErr = { ...localErr, email: "Email is required" }
        }

        if (!password) {
            localErr = { ...localErr, password: "Password is required" }
        }

        if (email || password || phone) {

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

        if (Object.entries(localErr).length) {
            return false;
        } else {
            const localInput = { ...inputs }
            delete localInput["phone"]
            const variables = { input: { ...localInput, 'phone': `+91${inputs.phone}` } };
            customerCreateMutation({ variables }).then(
                res => {
                    if (res?.data?.customerCreate?.customerUserErrors.length) {
                        console.log(res?.data?.customerCreate?.customerUserErrors[0]?.message)
                        NotificationManager.error(res?.data?.customerCreate?.customerUserErrors[0]?.message, 'Error')
                    } else {
                        NotificationManager.success("Registered successfully", 'Success')
                        navigate("/login", { replace: true })
                    }
                },
                err => {
                    console.log('create customer error', err);
                    NotificationManager.error(err?.message, 'Error')

                }
            );
        }

    }


    return (<div className='register-wrp'>
        <h1>Registration</h1>
        <Form>
            <FormGroup>
                <Input type="text" name="firstName" id="firstName" placeholder="First Name" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.firstName} />
            </FormGroup>
            <FormGroup>
                <Input type="text" name="lastName" id="lastName" placeholder="Last Name" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.lastName} />
            </FormGroup>
            <FormGroup>
                <Input type="number" name="phone" placeholder="Phone Number" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.phone} invalid={inputErr.hasOwnProperty('phone')} />
                <FormFeedback>{inputErr?.phone}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Input type="email" name="email" id="exampleEmail" placeholder="Email" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.email} invalid={inputErr.hasOwnProperty('email')} />
                <FormFeedback>{inputErr?.email}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Input type="password" name="password" id="examplePassword" placeholder="Password" onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} value={inputs?.password} invalid={inputErr.hasOwnProperty('password')} />
                <FormFeedback>{inputErr?.password}</FormFeedback>
            </FormGroup>
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
            <p className='text-danger'>{inputErr?.error}</p>
            <Button onClick={() => { onSubmit() }}>Submit</Button>
        </Form>
    </div>);
}

export default Register;