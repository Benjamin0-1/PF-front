import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import userSpecificReviews from './module.UserReviews.css';

const accessToken = localStorage.getItem('accessToken');
const USER_REVIEWS_URL = 'http://localhost:3001/user/reviews';

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
                const response = await FetchWithAuth(USER_REVIEWS_URL, {
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
            const response = await FetchWithAuth(`http://localhost:3001/review/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(reviewId) 
            });

            if (response.ok) {
                setReviews(prevReviews => prevReviews.filter(review => review.Review.id !== reviewId));
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
            <h2>User Reviews</h2>
            {noReviewsFound && <p className="message no-reviews-found">{noReviewsFound}</p>}
            {generalError && <p className="message error-message">{generalError}</p>}
            {reviewDeleted && <p className="message success-message">{reviewDeleted}</p>}
            {failedToDeleteReview && <p className="message error-message">{failedToDeleteReview}</p>}
            {reviews.map(product => (
                <div key={product.id} className="review-item">
                    <h4>{product.name}</h4>
                    {product.Reviews.map(review => (
                        <div key={review.id} className="review-content">
                            <strong>Review by:</strong> {review.User.username}
                            <p>{review.review}</p>
                            <div className="review-actions">
                                <button onClick={() => handleDelete(review.id)} className="review-delete-btn">Delete Review</button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default UserReviews;
