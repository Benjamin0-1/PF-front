import React, {useState} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";


const accessToken = localStorage.getItem('accessToken');


function profileIcon() {
    const [showProfilebutton, setShowProfielButton] = useState(null);

    if (accessToken) {
        setShowProfielButton(true)
    } else {
        setShowProfielButton(false)
    };

    return(
        <div>
            {showProfilebutton && <button onClick={() => {window.location.href = '/viewprofile'}}></button>}
        </div>
    )
}

// this button will simply go to the user's profile








// this button will only be shown if there is an accessToken