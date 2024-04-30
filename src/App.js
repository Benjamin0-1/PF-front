import React, {useState ,useEffect} from 'react';
import FetchWithAuth from './Components/Auth/FetchWithAuth';
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
import ReportedProduct from './Components/AdminComponents/ReportedProduct';
import CreateBrand from './Components/AdminComponents/CreateBrand';
import CreateReview from './Components/CreateReview';
import ReportProduct from './Components/ReportProduct';
import BanUser from './Components/AdminComponents/BanUser';
import Home from './Components/Home';
import Detail from './Components/Detail';
import AdminNavBar from './Components/AdminComponents/AdminNavBar';

function App() {

  /*
  const [isAdmin, setIsAdmin] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    const checkIsAdmin = async () => {
      try {
        const response = await FetchWithAuth('http://localhost:3001/profile-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        if (!data.is_admin) {
          window.location.href = '/notadmin';
        }
      } catch (error) {
        console.log(`error: ${error}`);
      }
    };

    checkIsAdmin();
  }, []); */



  return (
    <Router>
      <Routes>  
        <Route path='/signup' element={< Signup />} />
        <Route path='/login' element={< Login />} />
        <Route path='/home' element={< Home />} />
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
        <Route path='/reportedproducts' element={< ReportedProduct />} />
        <Route path='createbrand' element={< CreateBrand />} />
        <Route path='/createreview' element={< CreateReview/>} />
        <Route path='reportproduct' element={< ReportProduct />} />
        <Route path='banuser' element={< BanUser />} />
        <Route path='/detail/:id' element={< Detail />} />
      <Route path='*' element={<h1>404 Not Found</h1>}/> 
      <Route path='/notadmin'  element={<h1>No eres un admin, no puedes acceder al dashboard</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
