import style from "./NavBar.module.css"
import { useState, useEffect, useId } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../Search/SearchBar'
import FetchWithAuth from "../Auth/FetchWithAuth";
import Cart from "../Cart/Cart";
import iconUp from "../../assets/iconUp.png"
import iconDown from "../../assets/iconDown.png"
import { useSelector } from "react-redux";
import { useClerk } from "@clerk/clerk-react";
import iconPrincipal from "../../assets/RMIcon.jpg"

const NavBar = () => {
  const [ user, setUser ] = useState("")
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const [ open, setOpen ] = useState(false);
  const profileCheckboxId = useId();
  const accessToken = useSelector(state => state.user.tokens.accessToken);
  const userProfileName = useSelector(state => state.user.userProfile.first_name);
  const { signOut } = useClerk();

  const handleInputChange = (event) => {
    setOpen(event.target.checked);
  };

  useEffect(() => {
    if (!accessToken.length) {
      return setUser("")
    }
    return setUser(userProfileName)
  }, [ accessToken, userProfileName ]);

  const handleCloseSession = async (e) => {
    e.preventDefault();
    signOut();
    localStorage.clear();
    window.location.href = '/'
  };

  return (
    <nav className={ style.navBar }>
      <div className={ style.navBar_nav_container }>
        <Link className="link-logo" to="/">
          <img src={ iconPrincipal } alt="" />
          <h3>Reactive Mind Tech Store</h3>
        </Link>
        <div className={ style.search_container }>
          <SearchBar />
        </div>
        <div className={ style.navBar_right_side }>
          <div className={ style.search_profile_container }>
            <p>Hi, { user ? (<span>{ user }</span>) : (<span><Link to="/login">Sign in</Link></span>) }</p>
            <div className={ style.profile_links_container }>
              { user ? (
                <>
                  <label className={ style.account_button } htmlFor={ profileCheckboxId }>
                    <p>My account</p>
                    <img src={ open ? iconUp : iconDown } alt="" />
                  </label>
                  <input id={ profileCheckboxId } type="checkbox" onChange={ handleInputChange } hidden />
                  <nav className={ style.account }>
                    <ul className={ style.account_menu }>
                      <Link to="/viewprofile">Profile</Link>
                      <Link to="/viewprofile/favorites">My Favorites</Link>
                      <Link to="/viewprofile">History Payments</Link>
                      <hr />
                      <p onClick={ handleCloseSession }>Logout</p>
                    </ul>
                  </nav>
                </>
              ) : (
                <>
                  <Link to="/signup">Sign Up</Link>
                </>
              ) }
            </div>
          </div>
          <div className={ style.navBar_nav_icons_container }>
            <div className={ style.icons_cart_container }>
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;