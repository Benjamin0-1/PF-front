import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Detail.css';

function Detail() {
    const [generalError, setGeneralError] = useState('');
    const { id } = useParams(); // <-- Corrected: Added parentheses to useParams
    const [product, setProduct] = useState(null); // <-- Changed initial state to null

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
            </div>
            {product.Reviews.length > 0 && (
                <div className='reviews-container'>
                    <h3>Reviews</h3>
                    <ul>
                        {product.Reviews.map(review => (
                            <li className='review' key={review.id}>
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
