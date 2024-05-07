import React, {useState, useEffect} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import shippingDetailStyles from './module.ShippingDetail.css';

const accessToken = localStorage.getItem('accessToken');

let URL ='http://localhost:3001/shipping-info';

function ShippingDetail() {
    const [generalError, setGeneralError] = useState('');
    const [noDetailsFound, setNoDetailsFound] = useState('');
    const [details, setDetails] = useState([]);
    const [maxShippingMessage, setMaxShippingMessage] = useState('');
    const [invalidAddrDeletion, setInvalidAddrDeletion] = useState('');



    const fetchShippingDetails = async () => {
        try {

            const response = await FetchWithAuth(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const data = await response.json();

            if (data.length === 0) {
                setNoDetailsFound('Aun no tienes ninguna direccion de envio, intenta agregar una.');
                setGeneralError('');
                return;
            };

            if (data.invalidAddrDeletion) {
                setInvalidAddrDeletion('No puedes eliminar direcciones con las cuales ya has comprado productos');
                setGeneralError('');
            }

            if (data.length === 10) {
                setMaxShippingMessage('Advertencia: ya tienes el maximo de direcciones de envio posibles.');
                // este mensaje NO es un error, asi que no utilizo return keyword.
            };

            setDetails(data);
            setGeneralError('');
            setNoDetailsFound('');

            
        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Ha ocurrido un error');
            setNoDetailsFound('');
            
        };
    };

    useEffect(() => {fetchShippingDetails()}, []);

     // esta funcion tiene el proposito de automaticamente poder eliminar una shipping info, asi como con la seccion de favoritos.
     const handleDeleteShipping = async (shippingId) => {
        try {
            const response = await fetch(`http://localhost:3001/delete-shipping-info/${shippingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                // If deletion is successful, fetch updated shipping details
                fetchShippingDetails();
            } else {
                console.error('Failed to delete shipping address');
                setInvalidAddrDeletion('No puedes eliminar direcciones de envio con las cuales ya has comprado productos.')
            }
        } catch (error) {
            console.error(`Error deleting shipping address: ${error}`);
            setGeneralError('Ha ocurrido un error al eliminar la dirección de envío');
            setInvalidAddrDeletion('');
        }
    };

    return (
        <div className="ShippingDetail">
            <h2>Your Shipping Addresses:</h2>
            {invalidAddrDeletion && <p style={{color: 'red'}}>{invalidAddrDeletion}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {noDetailsFound && <p>{noDetailsFound}</p>}
            <ul>
                {details.map(detail => (
                    <li key={detail.shippingId}>
                        <p>Nickname: {detail.nickname}</p>
                        <p>Country: {detail.country}</p>
                        <p>City: {detail.city}</p>
                        <p>Zip Code: {detail.zip_code}</p>
                        <button className="delete-button" onClick={() => handleDeleteShipping(detail.shippingId)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );


    
};




export default ShippingDetail;
