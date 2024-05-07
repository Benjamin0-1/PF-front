import React, { useState, useEffect } from 'react';
import FetchWithAuth from './Auth/FetchWithAuth';
import { useParams } from 'react-router-dom';
import detailStyles from './module.Detail.css';

import { useDispatch } from 'react-redux';
import { addProductCart } from "../redux/actionProducts";

const accessToken = localStorage.accessToken;

function Detail() {
    const [generalError, setGeneralError] = useState('');
    const { id } = useParams(); // <-- Corrected: Added parentheses to useParams
    const [product, setProduct] = useState(null); // <-- Changed initial state to null
    const [productAlreadyAddedToFavoritesError, setProductAlreadyAddedToFavoritesError] = useState('');
    const [productAddedSuccessfully, setProductAddedSuccessfully] = useState('');
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const dispatch = useDispatch();
    const [favoritesButtonVisible, setFavoritesButtonVisible] = useState(false);
    const handleReviewToggle = () => setShowReviewForm(!showReviewForm);
    const [reportSuccess, setReportSuccess] = useState('');
    const [reportError, setReportError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
   
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken'); 
        setFavoritesButtonVisible(!!accessToken);
        setIsLoggedIn(!!accessToken);
    }, []); 
    
    const addToCart = () => {
        if (product.stock > 0) {
            dispatch(addProductCart(product));
            setCartSuccessMessage('Added to cart successfully!');
            setTimeout(() => setCartSuccessMessage(''), 3000);  // Clear the message after 3 seconds
        }
    };


    const handleReviewSubmit = async () => {
        if (!reviewText || !rating) {
            setReviewError('Por favor, proporcione tanto la reseña como la calificación.');
            return;
        }
        if (!/^\d+(\.\d+)?$/.test(rating) || rating < 1 || rating > 5) {
            setReviewError('La calificación debe ser un número entre 1 y 5.');
            return;
        }
    
        try {
            const response = await FetchWithAuth('http://localhost:3001/review', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', // Ensures server knows what format we expect
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ productId: id, review: reviewText, rating })
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                // Handling specific error messages based on the key returned
                if (responseData.missingRating) {
                    setReviewError(responseData.missingRating);
                } else if (responseData.invalidRating) {
                    setReviewError(responseData.invalidRating);
                } else if (responseData.missingProductId) {
                    setReviewError(responseData.missingProductId);
                } else if (responseData.invalidProductIdFormat) {
                    setReviewError(responseData.invalidProductIdFormat);
                } else if (responseData.existingReview) {
                    setReviewError(responseData.existingReview);
                } else if (responseData.productNotOwned) {
                    setReviewError(responseData.productNotOwned);
                } else {
                    setReviewError('Error desconocido, intente de nuevo.');
                }
                return;
            }
    
            setReviewSuccess(responseData.successMessage);
            setReviewText('');
            setRating('');
            setShowReviewForm(false);
        } catch (error) {
            setReviewError(`Error writing review: ${error.message}`);
        }
    };

    //report
    const handleReport = async () => {
        try {
            const response = await FetchWithAuth(`http://localhost:3001/products/report/id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ productId: id, reason: reportReason })
            });
    
            const responseData = await response.json();
            if (!response.ok) {
               
                if (responseData.missingFields) {
                    throw new Error(responseData.missingFields);
                } else if (responseData.productNotFound) {
                    throw new Error(responseData.productNotFound);
                } else if (responseData.productAlreadyReported) {
                    throw new Error(responseData.productAlreadyReported);
                } else {
                    
                    throw new Error('Error reporting product. Please try again later.');
                }
            }
    
           
            setReportSuccess(responseData.successMessage);
           
            setReportError('');
        } catch (error) {
            console.log(`error from catch reporting product: ${error}`);
            setReportError(`Error: ${error.message}`);
        }
    };
    
    

    const addToFavorites = async () => {
        const accessToken = localStorage.getItem('accessToken'); // Ensure access token is current
        if (!accessToken) return;

        try {
            const response = await FetchWithAuth('http://localhost:3001/products/user/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({productId: id})
            });

            const data = await response.json();
            if (data.productAlreadyAddedToFavorites) {
                setProductAlreadyAddedToFavoritesError('Ya has agreagdo este producto a favoritos.');
                setProductAddedSuccessfully('');
                return;
            };

            if (!response.ok) {
                console.log(`Error adding product ${id} to favorites.`);
                return;
            };

            setProductAddedSuccessfully('Producto agregado a favoritos exitosamente.');
            setProductAlreadyAddedToFavoritesError('');

        } catch (error) {
            console.log(`error adding to favorites: ${error}`);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/product-detail/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product detail');
                }
                const data = await response.json();
                setProduct(data);
                setGeneralError('');
            } catch (error) {
                console.error('Error fetching product detail:', error);
                setGeneralError('Error fetching product detail');
            }
        };

        fetchData();

    }, [id]);

    if (generalError) {
        return <div>{generalError}</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className='detail-container'>
            <div className='product-details'> 
                <h2>{product.product}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock}</p>
                <p>Attributes: {product.attributes}</p>
                <p>Brand: {product.Brand.brand}</p>
                <p>Categories:</p>
                <ul>
                    {product.Categories.map(category => (
                        <li key={category.id}>{category.category}</li>
                    ))}
                </ul>
                <img src={product.image} alt={product.product} />
                {favoritesButtonVisible && (
                    <button onClick={addToFavorites} className='addToFavoritesButton'>
                        Add to Favorites
                    </button>
                )}
                {productAlreadyAddedToFavoritesError && <p style={{color: 'red'}}>{productAlreadyAddedToFavoritesError}</p>}
                {productAddedSuccessfully && <p style={{color: 'green'}}>{productAddedSuccessfully}</p>}
                {product.stock > 0 && (
                    <button onClick={addToCart}>
                        Add to Cart
                    </button>
                )}
                {cartSuccessMessage && <p style={{color: 'green'}}>{cartSuccessMessage}</p>}

                <button onClick={handleReviewToggle}>Write a Review</button>
                {showReviewForm && (
                    <div>
                        <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write your review here" />
                        <input type="number" value={rating} onChange={e => setRating(e.target.value)} placeholder="Rating (1-5)" min="1" max="5" />
                        <button onClick={handleReviewSubmit}>Submit Review</button>
                    </div>
                )}
                {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
                {reviewSuccess && <p style={{ color: 'green' }}>{reviewSuccess}</p>}


            </div>


            <div className='Report'>
            {isLoggedIn && (
    <>
        <select value={reportReason} onChange={e => setReportReason(e.target.value)}>
            <option value="">Select a reason</option>
            <option value="inappropriate">Inappropriate Content</option>
            <option value="misleading">Misleading or False Information</option>
            <option value="other">Other</option>
        </select>
        <button onClick={handleReport}>Report Product</button>
        {reportSuccess && <p style={{ color: 'green' }}>{reportSuccess}</p>}
        {reportError && <p style={{ color: 'red' }}>{reportError}</p>}
    </>
)}

            </div>

            <br />

            {product.Reviews && product.Reviews.length > 0 && (
                <div className='reviews-container'>
                    <h3>Reviews</h3>
                    <ul>
                        {product.Reviews.map(review => (
                            <li className='review' key={review.id}>
                                <p>username: {review.User.username}</p>
                                <p>{review.review}</p>
                                <p>Rating: {review.rating}</p>
                                <p>Review Date: {review.reviewDate}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    

}

export default Detail;
