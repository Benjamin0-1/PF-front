import style from "./NavBar.module.css"
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../Search/SearchBar'
import FetchWithAuth from "../Auth/FetchWithAuth";
// import RMIcon from "../../assets/RMIcon.jpg"
// import cartEmpty from "../../assets/cartEmpty.png"
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProfile } from "../../redux/actionsProfile";
// import HomePage from '../../pages/HomePage/Home'
// import cartBuy from '../CartBuy/CartBuy'

let PROFILE_URL = 'http://localhost:3001/profile-info';
const accessToken = localStorage.getItem('accessToken');

const NavBar = () => {
  const [ user, setUser ] = useState("")
  //   const accesToken = localStorage.getItem("accessToken")
  const { pathname } = useLocation();
  //   const userInfo = useSelector(state => state.user.profileInfo);
  //   const dispatch = useDispatch()
  const navigate = useNavigate()
  const [ generalError, setGeneralError ] = useState('');
  const fetchProfile = async () => {
    try {
      const response = await FetchWithAuth(PROFILE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        setGeneralError('Ha ocurrido un error.');
        return;
      };

      const data = await response.json();

      setUser(data.first_name);

    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchProfile()
      return
    }
    setUser("")
  }, [ accessToken, fetchProfile ]);
  //   useEffect(() => {
  //     setUser(userInfo.first_name)
  //   }, [ userInfo ]);
  useEffect(() => {
    const links = document.querySelectorAll(`.${style.link}`);
    links.forEach((link) => {
      if (link.getAttribute('href') === pathname) {
        link.classList.add(style.active);
      } else {
        link.classList.remove(style.active);
      }
    });
  }, [ pathname ]);
  const handleCloseSession = async (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/'
  };

  return (
    <nav className={ style.navBar }>
      <div className={ style.navBar_nav_container }>
        <Link to="/" className={ style.icon_container }>
          {/* <img className={ style.icon } src={ RMIcon } alt="" /> */ }
        </Link>
        <div className={ style.search_container }>
          <SearchBar />
        </div>
        <div className={ style.navBar_right_side }>
          <div className={ style.search_profile_container }>
            { user ? <p>Hola, <span>{ user }</span></p> : <p>Hola, <span>Inicia tu sesion</span></p> }
            <div className={ style.profile_links_container }>
              { user ? (
                <>
                  <Link to="/viewprofile">Mi perfil</Link>
                  <hr />
                  <Link onClick={ handleCloseSession }>Cerrar sesion</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Ingresa</Link>
                  <hr />
                  <Link to="/signup">Registrate</Link>
                </>
              ) }
            </div>
          </div>
          <div className={ style.navBar_nav_icons_container }>
            <div className={ style.icons_cart_container }>
              {/* <img src={ cartEmpty } /> */ }
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;