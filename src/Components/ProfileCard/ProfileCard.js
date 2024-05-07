import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import style from "./ProfileCard.module.css"
import profileImg from "../../assets/ProfileImg.png"
const ProfileCard = () => {
    const [ userData, setUserData ] = useState({})
    const userInfo = useSelector(state => state.user.userProfile);

    useEffect(() => {
        setUserData(userInfo)
    }, [ userInfo ]);

    const date = new Date(userData.createdAt);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formatedData = date.toLocaleDateString('es-ES', options);

    return (
        <div className={ style.profile_card }>
            <div className={ style.image_container }>
                <img src={ profileImg } alt="imgDefault" />
            </div>
            <h3>{ userData.first_name } { userData.last_name }</h3>
            <p>Username: <span>{ userData.username }</span></p>
            <p>Joined on: <span>{ formatedData }</span></p>
            <button>Edit profile</button>
        </div>
    )
}

export default ProfileCard