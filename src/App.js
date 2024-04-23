import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './Components/Signup';
import DeleteUserById from './Components/AdminComponents/DeleteUserById';
import Login from './Components/Login';
//:
import Donation from './Components/Donation';
import BuyProduct from './Components/BuyProduct';
import CreateProduct from './Components/AdminComponents/CreateProduct';
import DeleteUserByUsername from './Components/AdminComponents/DeleteUserByUsername';
import DeleteUserByEmail from './Components/AdminComponents/DeleteUserByEmail';
import AllUsers from './Components/AdminComponents/AllUsers';
import SendMassiveEmail from './Components/AdminComponents/SendMassiveEmail';
import AllBrand from './Components/AllBrand';
import PasswordRecovery from './Components/PasswordRecovery';
import ResetPassword from './Components/ResetPassword';
import ViewProfile from './Components/ViewProfile';
import UpdateProduct from './Components/AdminComponents/UpdateProduct';
import PaymentHistory from './Components/PaymentHistory';

function App() {
  return (
    <Router>
      <Routes>  
        <Route path='/signup' element={< Signup />} />
        <Route path='/login' element={< Login />} />
        <Route path='/deleteuserbyid' element={< DeleteUserById />} />
        <Route path='/donate' element={< Donation />} />
        <Route path='/buy' element={< BuyProduct />} />
        <Route path='/createproduct' element={< CreateProduct />} />
        < Route path='/deleteuserbyusername' element={< DeleteUserByUsername/>} />
        <Route path='/deleteuserbyemail' element={< DeleteUserByEmail />} />
        <Route path='/allusers' element={< AllUsers />} />
        <Route path='sendmassiveeamil' element={< SendMassiveEmail />} />
        <Route path='allbrands' element={< AllBrand />} />
        <Route path='/passwordrecovery' element={< PasswordRecovery />} />
        <Route  path='/resetpassword' element={< ResetPassword />} />
        <Route path='/viewprofile' element={< ViewProfile />} />
        <Route path='updateproduct' element={< UpdateProduct />} />
        <Route  path='/paymenthistory'  element={< PaymentHistory />}/>
      <Route path='*' element={<h1>404 Not Found</h1>}/> 
      </Routes>
    </Router>
  );
}

export default App;
