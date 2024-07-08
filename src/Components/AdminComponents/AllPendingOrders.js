import React, { useEffect, useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import { Container, Box, TextField, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');
const API_URL = process.env.REACT_APP_URL;

function AllPendingOrders() {
    const [allPendingOrders, setAllPendingOrders] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortByAsc, setSortByAsc] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const ordersPerPage = 2;
    const totalPages = Math.ceil(totalCount / ordersPerPage);

    if (!accessToken) {
        window.location.href = '/login';
    }

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
                toast.error(`Error: ${error.message}`);
            }
        };

        checkIsAdmin();
    }, [accessToken]);

    const fetchPendingOrders = async () => {
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/all-orders/pending${sortByAsc ? '/asc' : '/desc'}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                toast.error('Error fetching orders');
                return;
            }

            const data = await response.json();
            setTotalCount(data.allPendingOrders.length);
            setAllPendingOrders(paginate(data.allPendingOrders, ordersPerPage));
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, [currentPage, sortByAsc]);

    const paginate = (array, pageSize) => {
        const startIndex = (currentPage - 1) * pageSize;
        return array.slice(startIndex, startIndex + pageSize);
    };

    const handleFulfill = async (orderId) => {
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/orders/fulfill`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ orderId })
            });

            const data = await response.json();

            if (data.orderAlreadyFulfilled) {
                toast.error(`Order ${orderId} is already fulfilled`);
                return;
            }

            toast.success(`Order ${orderId} fulfilled successfully`);
            fetchPendingOrders();
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSortToggle = () => {
        setSortByAsc(prevState => !prevState);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Container className="AllPendingOrders">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    All Pending Orders
                </Typography>
    
          
             {/*   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by Order ID"
                        variant="outlined"
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" color="primary">
                        <SearchIcon />
                    </Button>
                </Box> */}
                
                <Button variant="contained" onClick={handleSortToggle} sx={{ mb: 2 }}>
                    {sortByAsc ? 'Sort by Date Ascending' : 'Sort by Date Descending'}
                </Button>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Order Date</TableCell>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allPendingOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.order_date}</TableCell>
                                        <TableCell>{order.userId}</TableCell>
                                        <TableCell>{order.totalAmount}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" onClick={() => handleFulfill(order.id)} disabled={isLoading}>
                                                Fulfill Order
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>Page {currentPage} of {totalPages}</Typography>
                    <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </Box>
            <ToastContainer />
            < AdminNavBar/>
        </Container>
    );
    
}

export default AllPendingOrders;
