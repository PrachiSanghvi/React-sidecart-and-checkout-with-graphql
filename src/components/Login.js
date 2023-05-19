import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, FormFeedback } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';
import {customerAccessTokenCreate} from "./../apis/gqlApi"

const errObj = {
        email: "Please enter valid email",
        password: "Password length must be 8 and must have include letters,digits and special characters",
}

const Login = () => {

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });
    const [inputErr,setInputErr] = useState({})
    const [customerAccessTokenCreatesMutation] = useMutation(customerAccessTokenCreate);
        
    let navigate = useNavigate();


    const validate = () => {
        const {email,password} = inputs;
        let localErr = {}

        setInputErr({})

        if(!email){
            localErr = {...localErr,email:"Email is required"}
        }

        if(!password){
            localErr = {...localErr,password:"Password is required"}
        }

        if(email || password ){
            
        if(email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            localErr = {...localErr,email:errObj['email']}
        }

        if(password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)){
            localErr = {...localErr,password:errObj['password']}
        }
    }
    setInputErr(localErr)
    return localErr;
    }

    const onSubmit = () => {
       const localErr = validate();

       if(Object.entries(localErr).length){
           return false;
       }else{
        
        const variables = { input: inputs };
        customerAccessTokenCreatesMutation({ variables }).then(
         res => {
            if(res?.data?.customerAccessTokenCreate?.customerUserErrors.length){
                console.log(res?.data?.customerAccessTokenCreate?.customerUserErrors[0]?.message)
                //setInputErr({'error':res?.data?.customerAccessTokenCreate?.customerUserErrors[0]?.message})
                NotificationManager.error(res?.data?.customerAccessTokenCreate?.customerUserErrors[0]?.message, 'Error')

            }else{
                localStorage.setItem("token",res?.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken)
                NotificationManager.success("Logged in successfully!!", 'Success')
                navigate("/profile",{ replace: true })
            }
         },
         err => {
           console.log('customerAccessTokenCreate error', err);
           NotificationManager.error(err?.message, 'Error')
         }
       );
       }

    }


    return (<div className='register-wrp'>
        <h1>Login</h1>
        <Form>
            
            <FormGroup>
                <Input type="email" name="email" id="exampleEmail" placeholder="Email" onChange={(e)=>setInputs({...inputs,[e.target.name]:e.target.value})} value={inputs?.email} invalid={inputErr.hasOwnProperty('email')}/>
                <FormFeedback>{inputErr?.email}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Input type="password" name="password" id="examplePassword" placeholder="Password" onChange={(e)=>setInputs({...inputs,[e.target.name]:e.target.value})} value={inputs?.password} invalid={inputErr.hasOwnProperty('password')}/>
                <FormFeedback>{inputErr?.password}</FormFeedback>
            </FormGroup>
            
            {/* <p className='text-danger'>{inputErr?.error}</p> */}
            <Button onClick = {()=>{onSubmit()}}>Submit</Button>
        </Form>
    </div>);
}

export default Login;