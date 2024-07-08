import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import reportedproductsStyles from  './module.ReportedProduct.css';

const PORT = process.env.PORT || 3001;

const API_URL = process.env.REACT_APP_URL

const accessToken = localStorage.getItem('accessToken');

function ReportedProduct() {
    const [generalError, setGeneralError] = useState('');
    const [noRecordsFoundError, setNoRecordsFoundError] = useState('');
    const [records, setRecords] = useState([]);

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

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await FetchWithAuth(`${API_URL}/products/reported`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                setNoRecordsFoundError('No hay ningun reporte.');
                setGeneralError('');
                return;
            };

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error.');
                setNoRecordsFoundError('');
                return;
            };

            const data = await response.json();
            setRecords(data.result);

        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }

    return (
        <div className="ReportedProduct">
        
            <br/>
            <h2>Reported Products: {records.length}</h2>
            {generalError && <p className="error">{generalError}</p>}
            {noRecordsFoundError && <p className="error">{noRecordsFoundError}</p>}
            {records.map((record, index) => (
                <div key={index} className="review-item">
                    <p>Report ID: {record.id}</p>
                    <p>User: {record.User.username}</p>
                    <p>Product: {record.Product.product}</p>
                    <p>Reason: {record.reason || 'no reason was given'}</p>
                    <hr />
                </div>
            ))}
            <br />
            < AdminNavBar/>
            <br />
        </div>
      );
      

};



export default ReportedProduct;

