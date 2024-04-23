import React, {useState} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";

const accessToken = localStorage.getItem('accessToken');

const URL  = ''

function CreateBrand() {
    const [brandName, setBrandName] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCreation = async () => {
        try {
            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {},
                body: JSON.stringify({brandName})
            });

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error')
                return;
            }
            
            setSuccessMessage(`Marca ${brandName} creada con exito`);

        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }
};