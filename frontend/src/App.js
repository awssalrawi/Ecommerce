import { useEffect } from 'react';
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
function App() {
  useEffect(() => {
    store.dispatch(loadUser());
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
            <Route exact path="/cart" element={<Cart />} />
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
