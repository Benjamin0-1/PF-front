import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import userSpecificReviews from './module.UserReviews.css';
import Rating from 'react-rating-stars-component'; // <-- rating stars
import { Button, Card, Typography, Snackbar } from '@mui/material';
const API_URL = process.env.REACT_APP_URL

const accessToken = localStorage.getItem('accessToken');


// IMPORTANTE: <--------- FALTA PODER ELIMINAR REVIEW.

function UserReviews() {
    const [generalError, setGeneralError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [noReviewsFound, setNoReviewsFound] = useState('');
    const [reviewDeleted, setReviewDeleted] = useState('');
    const [failedToDeleteReview, setFailedToDeleteReview] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    }

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await FetchWithAuth(`${API_URL}/user/reviews`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();

                if (data.noProductsFound) {
                    setNoReviewsFound(data.noProductsFound)
                    setGeneralError('');
                    return
                };

                setReviews(data)
                setGeneralError('');
                setNoReviewsFound('');

                

            } catch (error) {
                console.log(`Error: ${error}`);
                setGeneralError('An error occurred while fetching reviews.');
            }
        };

        fetchUserReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        try {
            const response = await FetchWithAuth(`${API_URL}/review/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
              //  setReviews(prevReviews => prevReviews.filter(review => review.Review.id !== reviewId)); // <-- genera ERROR MASIVO
                setReviewDeleted('review deleted successfully')
            } else {
                setFailedToDeleteReview('Failed to delete review')
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            setFailedToDeleteReview('Failed to delete review')
        }
    };

    return (
        <div className="UserReviews">
            <Typography variant="h4">User Reviews</Typography>
            {noReviewsFound && <Typography className="message no-reviews-found">{noReviewsFound}</Typography>}
            {generalError && <Typography className="message error-message">{generalError}</Typography>}
            {reviewDeleted && <Snackbar open message={reviewDeleted} autoHideDuration={6000} />}
            {failedToDeleteReview && <Snackbar open message={failedToDeleteReview} autoHideDuration={6000} />}
            {reviews.map(product => (
                <Card key={product.id} className="review-item">
                    <Typography variant="h5">{product.product} - ${product.price.toFixed(2)}</Typography>
                    <img src={product.image} alt={product.product} className="product-image"/>
                    <Typography className="product-description">{product.description}</Typography>
                    {product.Reviews.map(review => (
                        <div key={review.id} className="review-content">
                            <Typography variant="subtitle1">Review by: {review.User.username}</Typography>
                            <Typography>Review: {review.review}</Typography>
                            <Rating
                                value={review.rating}
                                size={20}
                                isHalf={true}
                                edit={false}
                            />
                            <Button variant="contained" color="secondary" onClick={() => handleDelete(review.id)}>Delete Review</Button>
                        </div>
                    ))}
                </Card>
            ))}
        </div>
    );
}

export default UserReviews;
