import React, { useState, useEffect } from "react";
import FetchWithAuth from "../../Components/Auth/FetchWithAuth";
import './ViewProfile.css';
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

function ViewProfile() {
    const [ profileInfo, setProfileInfo ] = useState({});
    const [ profilePath, setProfilePath ] = useState("")
    const userInfo = useSelector(state => state.user.userProfile);
    const userAdmin = useSelector(state => state.user.isAdmin);
    const accessToken = useSelector(state => state.user.tokens.accessToken);
    const { pathname } = useLocation();
    const pathArray = pathname.split('/');
    const lastSegment = pathArray[ pathArray.length - 1 ];


    useEffect(() => {
        if (lastSegment !== "viewprofile") {
            console.log(lastSegment);
            return setProfilePath(lastSegment);
        }
        return setProfilePath("")
    }, [ lastSegment ]);
    useEffect(() => {
        if (!accessToken) {
            return window.location.href = '/login'
        }
        return setProfileInfo(userInfo);
    }, [ userInfo, accessToken ]);


    return (
        <div className="ViewProfile">
            <div className="profile-menu">
                { profilePath.length ? <h1>{ profilePath.charAt(0).toUpperCase() + profilePath.slice(1) }</h1> : (
                    <>
                        <h1>Hi, { profileInfo.first_name } { profileInfo.last_name }</h1>
                        <h2>Take a look at your profile</h2>
                    </>
                ) }
            </div>
            <div className="profile-main">
                <Outlet />
                {/* <p>First name: { profileInfo.first_name || 'Error mostrando nombre' }</p>
                <p>Last name: { profileInfo.last_name || 'Error mostrando apellido' }</p>
                <p>Username: { profileInfo.username }</p>
                <p>Email: { profileInfo.email }</p>
                <p>Admin: { profileInfo.is_admin ? 'Yes' : 'No' }</p>
                <p>Two Factor Authentication: { profileInfo.two_factor_authentication ? 'Enabled' : 'Disabled' }</p>
                <p>Te uniste en la fecha: { profileInfo.createdAt }</p>
                <br /> */}
                {/* { isButtonVisible && <button onClick={ () => window.location.href = '/activate2fa' }> Enable Two-Factor Authentication </button> } */ }

            </div>

        </div>
    );

}

export default ViewProfile;
