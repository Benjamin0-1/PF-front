import React, {useState, useEffect} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";

const accessToken = localStorage.getItem('accessToken');

function ShippingDetail() {
    const [generalError, setGeneralError] = useState('');


    const fetchShippingDetails = async () => {
        try {
            
        } catch (error) {
            
        }
    };

    
};




export default ShippingDetail;