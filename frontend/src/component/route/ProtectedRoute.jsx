import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from './../../actions/userActions';
const ProtectedRoute = ({ children, isAdmin }) => {
  const {
    isAuthenticated = false,
    loading = true,
    user,
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      return dispatch(loadUser());
    }
  }, [dispatch, user, isAuthenticated, loading]);
  if (loading) {
    return <h1>...Loading</h1>;
  }
  if (!loading === isAuthenticated) {
    // if (isAdmin && user.role !== 'admin') {
    //   return <Navigate to="/" />;
    // }
    if (isAdmin && user.role !== 'admin') {
      return <Navigate to={'/'} />;
    }
    return children;
  } else return <Navigate to={'/login'} />;
};

export default ProtectedRoute;
