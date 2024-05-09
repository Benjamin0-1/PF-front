import React, {useState } from 'react';
import FetchWithAuth from './Components/Auth/FetchWithAuth';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
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
import ReportProduct from './Components/ReportProduct';
import BanUser from './Components/AdminComponents/BanUser';
import Home from './Components/Home';
import Detail from './Components/Detail';
import AdminNavBar from './Components/AdminComponents/AdminNavBar';
import Logout from './Components/Logout';
import AdminDashboard from './Components/AdminComponents/AdminDashboard';
import DeletedUser from './Components/AdminComponents/DeletedUser';
import CreateUser from './Components/AdminComponents/CreateUser';
import FAQ from './Components/FAQ';
import Sidebar from './Components/Sidebar';
import Favorite from './Components/Favorite';
import DeleteProductById from './Components/AdminComponents/DeleteProductById';
import Shipping from './Components/Shipping';
import Order from './Components/Order';
import ShippingDetail from './Components/ShippingDetail';
import Newsletter from './Components/Newsletter';
import EmailNewsletter from './Components/AdminComponents/EmailNewsletter';
import AllNewsLetterEmail from './Components/AdminComponents/AllNewsLetterEmail';
import VisualChart from './Components/AdminComponents/VisualChart'; // <-- VERIFICAR !
import ReportProductByName from './Components/ReportProductByName';
import AllPendingOrders from './Components/AdminComponents/AllPendingOrders';
import Active2FA from './Components/AdminComponents/Activate2FA';
import GrantAdminByUsername from './Components/AdminComponents/GrantAdminByUsername';
import AdvancedFilter from './Components/AdvancedFilter';
import UpdateProfileInfo from './Components/UpdateProfileInfo';
import UpdateProfilePassword from './Components/UpdateProfilePassword';
import UserReviews from './Components/UserReviews';
//import Cart from './Components/Cart';  // <-- CART
import ShoppingCart from './Components/ShoppingCart';
import ViewCart from './Components/ViewCart';
import LandingPage from './Components/VisualComponents/LandingPage';
import AboutUsPage from './Components/AboutUs';
import GoogleLogin from './Components/GoogleLogin';

import HomeButton from './Components/HomeButton';


import NotFoundPage from './Components/NotFoundPage';
import PaymentCancelled from './Components/PaymentCancelled';



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };




  return (
    <Router>

      <HomeButton />
     

      < ShoppingCart/>
      
    
      < Logout/>

      <Sidebar isOpen={sidebarOpen} />

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
        <Route path='reportproduct' element={< ReportProduct />} />
        <Route path='banuser' element={< BanUser />} />
        <Route path='/detail/:id' element={< Detail />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/deletedusers' element={< DeletedUser />} />
        <Route path='/createuser' element={< CreateUser />} />
        <Route path='/faq' element={< FAQ />} />
        <Route path='newsletter' element={< Newsletter />} />
        <Route path='/favorites' element={<  Favorite/>} />
        <Route path='/deleteproductbyid' element={< DeleteProductById />} />
        <Route path='/shipping' element={< Shipping />} />
        <Route path='/orders' element={< Order />} />
        <Route path='/shippingdetails' element={< ShippingDetail />} />
        <Route path='/emailnewsletter' element={< EmailNewsletter />} />
        <Route path='/allnewsletteremails' element={< AllNewsLetterEmail />} />
        <Route path='/visualchart' element={< VisualChart />} />
        <Route path='/reportproductbyname' element={< ReportProductByName />} />
        <Route path='/allpendingorders' element={ < AllPendingOrders /> } />
        <Route path='/activate2fa'  element={< Active2FA />}/>
        <Route path='/grantadminbyusername' element={< GrantAdminByUsername/>} />
        <Route path='/updateprofileinfo' element={< UpdateProfileInfo />} />
        <Route path='/updateprofilepassword' element={< UpdateProfilePassword />} />
        <Route path='/userreviews' element={< UserReviews />} />
        <Route path='/advancedfilters' element={< AdvancedFilter />} />
        <Route path='/shoppingcart' element={< ShoppingCart />} />
       <Route path='/viewcart' element={< ViewCart />} />
      <Route path='/google' element={< GoogleLogin />} />
     <Route path='/landingpage' element={< LandingPage />} />

     
    
      <Route path='*' element={<NotFoundPage />}/> 

      <Route path='/paymentcancelled' element={< PaymentCancelled />} />
      <Route path='/aboutus' element={< AboutUsPage/>} />


      <Route path='/notadmin'  element={<h1 style={{marginLeft: '200px'}}> You are not an admin </h1>} />
      <Route  path='/ordercancelled' element={<h1 style={{marginLeft: '200px'}}>Order has been cancelled</h1>} />
      <Route path='/errorprocessingorder' element={<h1 style={{marginLeft: '200px'}} >Error processing order</h1>} />
      <Route path='/' element={< LandingPage/>} />
      </Routes>

    

    </Router>
    
  );
  
}

export default App;
