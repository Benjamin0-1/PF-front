import React, { useState, useEffect } from "react";
import FetchWithAuth from "../../Components/Auth/FetchWithAuth";
import './ViewProfile.css';
import { useSelector } from "react-redux";

function ViewProfile() {
    const [ profileInfo, setProfileInfo ] = useState({});
    const userInfo = useSelector(state => state.user.userProfile);
    const userAdmin = useSelector(state => state.user.isAdmin);
    const accessToken =  useSelector(state => state.user.tokens.accessToken);

    if (!accessToken) {
        window.location.href = '/login'
    }

    useEffect(() => {
        setProfileInfo(userInfo);
    }, [userInfo]);

    // const fetchProfile = async () => {
    //     try {
    //         const response = await FetchWithAuth(PROFILE_URL, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${accessToken}`
    //             }
    //         });

    //         if (!response.ok) {
    //             setGeneralError('Ha ocurrido un error.');
    //             return;
    //         };

    //         const data = await response.json();

    //         // enable button for admins.
    //         if (data.is_admin && !data.two_factor_authentication) {
    //             setIsButtonVisible(true)
    //         };

    //         setProfileInfo(data);

    //     } catch (error) {
    //         console.log(`ERROR: ${error}`);
    //     }
    // }



    return (
        <div className="ViewProfile">
            <div className="profile-menu">
                <p>Name</p>
            </div>
            <div className="profile-main">
                <p>First name: { profileInfo.first_name || 'Error mostrando nombre' }</p>
                <p>Last name: { profileInfo.last_name || 'Error mostrando apellido' }</p>
                <p>Username: { profileInfo.username }</p>
                <p>Email: { profileInfo.email }</p>
                <p>Admin: { profileInfo.is_admin ? 'Yes' : 'No' }</p>
                <p>Two Factor Authentication: { profileInfo.two_factor_authentication ? 'Enabled' : 'Disabled' }</p>
                <p>Te uniste en la fecha: { profileInfo.createdAt }</p>
                <br />
                {/* { isButtonVisible && <button onClick={ () => window.location.href = '/activate2fa' }> Enable Two-Factor Authentication </button> } */}

            </div>

        </div>
    );

}

export default ViewProfile;
