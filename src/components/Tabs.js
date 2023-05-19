import React, { useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';
import Profile from './Profile';
import Header from './Header';
import Address from './Address';
import {custQuery} from './../apis/gqlApi';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';


const Tabs = () => {
 const [activeTab,setActiveTab] = useState('1');

//  const { loading, error, data  } = useQuery(query, {
//     variables: { customerAccessToken: localStorage.getItem("token") }
//  });

 const [customerQuery,{ loading, error, data  } ] = useLazyQuery(custQuery,{fetchPolicy: "network-only" });

 useEffect(()=>{
    customerQuery( {
            variables: { customerAccessToken: localStorage.getItem("token") }
         });
 },[])


  const toggle = (tab) => {
    if (activeTab !== tab) {
        setActiveTab(tab);
    }
  }
  
    return (
      <div>
          <Header/>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Profile
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Address
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
              <Profile loading={loading} error={error} data={data}/>
          </TabPane>
          <TabPane tabId="2">
            <Address loading={loading} error={error} data={data} customerQuery ={customerQuery }/>
          </TabPane>
        </TabContent>
      </div>
    );
  }

export default Tabs;  
