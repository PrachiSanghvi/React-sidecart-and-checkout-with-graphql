import React, { useEffect, useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import SideCart from './SideCart';
import cart from "./../images/cart.png"
import {customerAccessTokenDelete} from "./../apis/gqlApi"

const Header = ({checkoutData,openSideCart}) => {
  const [collapsed,setCollapsed] = useState(true);
  const [isOpen,toggleDrawerStatus] = useState(false);
  let navigate = useNavigate();

  const [customerAccessTokenDeleteMutation] = useMutation(customerAccessTokenDelete);

  useEffect(()=>{
    console.log("openSideCart====",openSideCart)
    if(openSideCart)
    {
      toggle()
    }
  },[openSideCart])

  const toggleNavbar = () => {
    setCollapsed( !collapsed);
  }

  const toggle = () =>{
    // setOpenSideCart(!isOpen)
    toggleDrawerStatus(!isOpen);
  }

  const handleLogout = () => {
    const variables = { customerAccessToken: localStorage.getItem("token") };
    customerAccessTokenDeleteMutation({ variables }).then(
         res => {
            if(res?.data?.customerAccessTokenDelete?.userErrors.length){
                console.log(res?.data?.customerAccessTokenDelete?.userErrors[0]?.message)
                
            }else{
               localStorage.removeItem("token")
                navigate("/login",{ replace: true })
            }
         },
         err => {
           console.log('customerAccessTokenDelete error', err);
         }
       );
  }


    return (
      <div>
        {console.log(checkoutData)}
        <SideCart toggle={toggle} isOpen={isOpen} checkoutData={checkoutData}/>
        <Navbar color="faded" light>
          <NavbarBrand className="mr-auto">ShopifyDemo</NavbarBrand>
            <img src={cart} width={30} style={{marginLeft:'80%'}} onClick={()=>toggle()}/>
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse isOpen={!collapsed} navbar>
            <Nav navbar>
            <NavItem>
                <NavLink href="/profile">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/products">Products</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={()=>handleLogout()}>Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
          
        </Navbar>
        
        
      </div>
    );
  
}

export default Header;