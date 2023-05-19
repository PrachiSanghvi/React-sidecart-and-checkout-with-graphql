import React from 'react';
import { Outlet  , Navigate  } from 'react-router-dom';

const PrivateRoute = () => {
    return localStorage.getItem("token") ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;