import { useEffect } from "react";
import React from "react";
import AdminNavBar from "./AdminNavBar";
import FetchWithAuth from "../Auth/FetchWithAuth";

const accessToken = localStorage.getItem('accessToken');

function AdminDashboard() {


     /* if (!accessToken) {
        window.location.href = '/login'
    };

    useEffect(() => {
        const checkIsAdmin = async () => {
          try {
            const response = await FetchWithAuth('http://localhost:3001/profile-info', {
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
      */

    return (
        <div className="AdminDashboard">
            <AdminNavBar/>
        </div>
    )
};

export default AdminDashboard;