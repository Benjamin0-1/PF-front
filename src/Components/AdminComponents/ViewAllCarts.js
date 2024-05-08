import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";

// import module as from './' 

const accessToken = localStorage.getItem('accessToken');

let ALL_CARTS_URL = 'http://localhost:3001/carts/view-all-carts';

function ViewAllCarts() {
    const [generalError, setGeneralError] = useState(''); // <-- for the catch block
    const [isLoading, setIsLoading] = useState(false) // <-- if it takes too long.

    useEffect(() => {
       const fetchAllCarts = async () => {
            
        try {
            
            const response = await FetchWithAuth(ALL_CARTS_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const data = await response.json();

        } catch (error) {
            console.log(`error fetching all carts: ${ViewAllCarts}`);
        }

     }
       //fetchAllCarts()

    }, []);

    // other functions.

    // pagination.

    return(
        <div className="ViewAllCarts-admin-component1"></div>
    );


};




export default ViewAllCarts;

// this component will rener everything inside the server cart (everything the user added to its cart).

// it will also render all shipping addresses associated to the user, providing a 'click' functionality for it.
// because the checkout route requires the user to select a shipping address in order for it to work.

