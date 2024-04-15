import './App.css';
import Header from './Components/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './Components/Signup';
import Signin from './Components/Signin';
import Welcome from './Components/Welcome';
import { useDispatch } from 'react-redux';
import { useGetUserDetailsQuery } from './services/auth/authService';
import { authActions } from './store';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  const { data, isFetching } = useGetUserDetailsQuery('userDetails');

  useEffect(() => {
    // if (data) dispatch(setCredentials(data))
    if (data?.success) {
      dispatch(authActions.setCredentials(data))
    }
  }, [data, dispatch])

  return (
    <div>
      <BrowserRouter>
        <Header isFetching={isFetching} />

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
