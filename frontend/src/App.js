import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/layout/Header.jsx';
import Footer from './component/layout/Footer.jsx';
import Home from './component/Home';
import ProductDetails from './component/product/ProductDetails';
import Login from './component/user/Login';
import Register from './component/user/Register';
import { loadUser } from './actions/userActions';
import store from './store';
import Profile from './component/user/Profile';
import ProtectedRoute from './component/route/ProtectedRoute';
import UpdateProfile from './component/user/UpdateProfile';
import UpdatePassword from './component/user/UpdatePassword';
import ForgotPassword from './component/user/ForgotPassword.jsx';
import NewPassword from './component/user/NewPassword';
import Cart from './component/cart/Cart';
import Shipping from './component/cart/Shipping';
import ConfirmOrder from './component/cart/ConfirmOrder';
import Payment from './component/cart/Payment';
import axios from 'axios';
//*payment
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/cart/OrderSuccess.jsx';
import ListOrders from './component/order/ListOrders';
import OrderDetails from './component/order/OrderDetails';
function App() {
  const [stripApiKey, setStripeApiKey] = useState('');
  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');
      setStripeApiKey(data.stripApiKey);
    }

    getStripeApiKey();
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<Home />} />
            <Route exact path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              exact
              path="/me"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route exact path="/me/update" element={<UpdateProfile />} />
            <Route exact path="/password/update" element={<UpdatePassword />} />
            <Route exact path="/password/forgot" element={<ForgotPassword />} />
            <Route exact path="/shipping" element={<Shipping />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/order/confirm" element={<ConfirmOrder />} />
            <Route exact path="/success" element={<OrderSuccess />} />
            <Route exact path="/orders/me" element={<ListOrders />} />
            <Route exact path="/order/:id" element={<OrderDetails />} />
            {stripApiKey && (
              <Route
                exact
                path="/payment"
                element={
                  <Elements stripe={loadStripe(stripApiKey)}>
                    <Payment />
                  </Elements>
                }
              />
            )}
            <Route
              exact
              path="/password/reset/:token"
              element={<NewPassword />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
