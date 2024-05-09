import React, { useState, useEffect } from 'react';
import FetchWithAuth from './Auth/FetchWithAuth';
import { useParams } from 'react-router-dom';
import detailStyles from './module.Detail.css';
import ProfileIcon from './ProfileIcon';
import ViewCartIcon from './ViewCartIcon';
import LoginIconButton from './LoginIcon';
import AdminButtonIcon from './AdminButtonIcon';
import Rating from 'react-rating-stars-component'; 
import { IoCartOutline, IoHeartOutline, IoFlagOutline, IoCheckmarkOutline, IoPencil } from 'react-icons/io5';
 // nuevos estilos 


const accessToken = localStorage.accessToken;

function Detail() {
    const [generalError, setGeneralError] = useState('');
    const { id } = useParams(); // 
    const [product, setProduct] = useState(null); 
    const [productAlreadyAddedToFavoritesError, setProductAlreadyAddedToFavoritesError] = useState('');
    const [productAddedSuccessfully, setProductAddedSuccessfully] = useState('');
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const [reviewText, setReviewText] = useState('');
   // const [rating, setRating] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    const [favoritesButtonVisible, setFavoritesButtonVisible] = useState(false);
    const handleReviewToggle = () => setShowReviewForm(!showReviewForm);
    const [reportSuccess, setReportSuccess] = useState('');
    const [reportError, setReportError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [quantity, setQuantity] = useState(1);   // quantity
    const [productAddedToCartSuccess, setProductAddedToCartSuccess] = useState('');
    const [showCartSuccessMessage, setShowCartSuccessMessage] = useState(false); 
    const [rating, setRating] = useState(0);
   
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken'); 
        setFavoritesButtonVisible(!!accessToken);
        setIsLoggedIn(!!accessToken);
    }, []); 


    const handleQuantityChange = (increment) => {
        setQuantity(prev => increment ? Math.max(1, prev + 1) : Math.max(1, prev - 1));
    };

    const addToServerCart = async () => {
        try {
            const response = await FetchWithAuth('http://localhost:3001/user/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId: id, quantity })
            });
            if (!response.ok) throw new Error('Failed to add product to cart');


            setShowCartSuccessMessage(true);

           

            setProductAddedToCartSuccess('Product added to cart successfully')
         //   alert('Product added to server cart successfully!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };



    useEffect(() => {
        let timer;
        if (showCartSuccessMessage) {
            timer = setTimeout(() => {
                setShowCartSuccessMessage(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showCartSuccessMessage]);
 


    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };
    



    const handleReviewSubmit = async () => {
        if (!reviewText || !rating) {
            setReviewError('Please provide a review and a rating.');
            return;
        }
        if (!/^\d+(\.\d+)?$/.test(rating) || rating < 1 || rating > 5) {
            setReviewError('Rating must be between 1 and 5.');
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
                    setReviewError('An error has ocurred, please try again.');
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
                setProductAlreadyAddedToFavoritesError('You have already added this product to your favorites.');
                setProductAddedSuccessfully('');
                return;
            };

            if (!response.ok) {
                console.log(`Error adding product ${id} to favorites.`);
                return;
            };

            setProductAddedSuccessfully('Product added to favorites.');
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
            <ProfileIcon/>
            <ViewCartIcon/>
            <LoginIconButton/>
            <AdminButtonIcon/>
            <div className='product-details'>
                <h2>{product.product}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock}</p>
                <p>Attributes: {product.attributes}</p>
                <p>Brand: {product.Brand.brand}</p>
                <p>Category:</p>
                <ul>
                    {product.Categories.map(category => (
                        <li key={category.id}>{category.category}</li>
                    ))}
                </ul>
                <img src={product.image} alt={product.product} />
    
                <div className='quantity-controls'>
                    <button onClick={() => handleQuantityChange(false)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleQuantityChange(true)}>+</button>
                </div>
    
                <IoCartOutline size={24} onClick={addToServerCart} style={{ cursor: 'pointer' }} title="Add to Cart"/>
                {showCartSuccessMessage && (
                    <div className='success-message'>
                        <p>Product added to cart successfully!</p>
                    </div>
                )}
    
                {favoritesButtonVisible && (
                    <IoHeartOutline size={24} onClick={addToFavorites} style={{ cursor: 'pointer', color: 'red' }} title="Add to Favorites"/>
                )}
                {productAlreadyAddedToFavoritesError && <p style={{color: 'red'}}>{productAlreadyAddedToFavoritesError}</p>}
                {productAddedSuccessfully && <p style={{color: 'green'}}>{productAddedSuccessfully}</p>}
    
                <IoPencil size={24} onClick={handleReviewToggle} style={{ cursor: 'pointer' }} title="Write a Review"/>
                
                {showReviewForm && (
                    <div>
                        <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write your review here" />
                        <Rating
                            value={rating}
                            onChange={handleRatingChange}
                            size={24}
                            activeColor="#ffd700"
                            isHalf={true}
                            edit={true}
                        />
                        <IoCheckmarkOutline size={24} onClick={handleReviewSubmit} style={{ cursor: 'pointer' }} title="Submit Review"/>
                    </div>
                )}
                {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
                {reviewSuccess && <p style={{ color: 'green' }}>{reviewSuccess}</p>}
            </div>
    
            <div className='Report'>
            {isLoggedIn && (
                <>
                <select 
                    value={reportReason} 
                    onChange={e => setReportReason(e.target.value)}
                    style={{
                        fontSize: '12px', // Smaller font size
                        padding: '5px', // Reduced padding
                        height: '30px', // Smaller height
                        width: '200px' // Narrower width
                    }}
                >
                    <option value="">Select a reason</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="false-info">Misleading or False Information</option>
                    <option value="bad-quality">Bad quality</option>
                    <option value="fake">It's a fake</option>
                    <option value="community-guidelines">Does not follow community guidelines</option>
                    <option value="breaks-easily">It breaks easily</option>
                </select>

                    <IoFlagOutline size={24} onClick={handleReport} style={{ cursor: 'pointer' }} title="Report Product"/>
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
                            <li key={review.id}>
                                <p>{review.User.username}</p>
                                <p>{review.review}</p>
                                <Rating
                                    value={review.rating}
                                    size={24}
                                    isHalf={true}
                                    edit={false}
                                />
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

