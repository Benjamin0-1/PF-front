import React, { useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import DeleteProductById from "./DeleteProductById";

const accessToken = localStorage.getItem('accessToken');

const API_URL = process.env.REACT_APP_URL

function ParentProductDelete() {
    const [generalError, setGeneralError] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    };

    useEffect(() => {
        const checkIsAdmin = async () => {
          try {
            const response = await FetchWithAuth(`${API_URL}/profile-info`, {
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
      }, []);


      // <-- the point of this component is to render all of the product deletion components.
      return(
        <div> 

        </div>
      )
};