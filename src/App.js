import './App.scss';
import ProductList from './components/ProductList';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from './components/ProductDetail';
import Register from './components/Registration';
import Login from './components/Login';
import Checkout from "./components/Checkout";
import PrivateRoute from './components/PrivateRoute';
import { NotificationContainer } from 'react-notifications';
import Tabs from './components/Tabs';

function App() {

  return (
    <BrowserRouter>
      <NotificationContainer />
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route exact path='/profile' element={<PrivateRoute/>}>
            <Route exact path='/profile' element={<Tabs/>}/>
        </Route>
        <Route exact path='/products' element={<PrivateRoute/>}>
            <Route exact path='/products' element={<ProductList/>}/>
        </Route>
        <Route exact path='/products/:id' element={<PrivateRoute/>}>
            <Route exact path='/products/:id' element={<ProductDetail/>}/>
        </Route>
        <Route exact path='/checkout' element={<PrivateRoute/>}>
            <Route exact path='/checkout' element={<Checkout/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

