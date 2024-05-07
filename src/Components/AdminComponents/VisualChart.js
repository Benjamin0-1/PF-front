import React, {useEffect} from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import AdminDashboard from "./AdminDashboard";

import FetchWithAuth from "../Auth/FetchWithAuth";
import "./visualChart.css"

const accessToken = localStorage.getItem('accessToken');

// average cost of totalAmount: <-- can be grabbed from Order or PaymentHistory.
// the later one provides more data.

const VisualChart = () => {



     /* if (!accessToken) {
        window.location.href = '/login'
    };
 */
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

    const UserData = [
      { year: 2016, userGain: 80000, userLost: 823 },
      { year: 2017, userGain: 45677, userLost: 345 },
      { year: 2018, userGain: 78888, userLost: 555 },
      { year: 2019, userGain: 90000, userLost: 4555 },
      { year: 2020, userGain: 6500, userLost: 234 },
    ];
  
    const data = {
      labels: UserData.map((data) => data.year),
      datasets: [
        {
          label: "Users Gained",
          data: UserData.map((data) => data.userGain),
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    };
  
    return (
        <div className="container">
          <h2>Visual Chart</h2>
          <div className="chartContainer">            
            <Bar data={data} />                 
          </div>
          <AdminDashboard />
        </div>
      );
      


  };
  
  export default VisualChart;