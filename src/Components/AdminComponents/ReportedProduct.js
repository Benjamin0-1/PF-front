import React, {useState, useEffect} from "react";

import FetchWithAuth from "../Auth/FetchWithAuth";

const PORT = process.env.PORT || 3001;
const URL = `http://localhost:${PORT}/`;

const accessToken = localStorage.getItem('accessToken');

function ReportedProduct() {
    const [generalError, setGeneralError] = useState('');
    const [noRecordsFoundError, setNoRecordsFoundError] = useState('');
    const [records, setRecords] = useState([]);

    if (!accessToken) {
        window.location.href = '/login'
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await FetchWithAuth(URL, {
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
            <h2>Reported Products: {records.length}</h2>
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {noRecordsFoundError && <p style={{ color: 'red' }}>{noRecordsFoundError}</p>}
            {records.map((record, index) => (
                <div key={index}>
                    <p>Report ID: {record.id}</p>
                    <p>User: {record.User.username}</p>
                    <p>Product: {record.Product.product}</p>
                    <hr />
                </div>
            ))}
        </div>
    )

};



export default ReportedProduct;

