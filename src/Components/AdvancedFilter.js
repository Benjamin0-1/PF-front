import React, { useState, useEffect } from "react";
import advandedfiltercss from './module.AdvancedFilters.css'

function AdvancedFilter() {
    const [startPrice, setStartPrice] = useState(0);
    const [endPrice, setEndPrice] = useState(500);
    const [startRating, setStartRating] = useState(1);
    const [endRating, setEndRating] = useState(5);
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [categories, setCategories] = useState([]); // Assume you fetch this from the server
    const [brands, setBrands] = useState([]); // Assume you fetch this from the server
    const [generalError, setGeneralError] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simulating fetching of categories and brands
        setCategories(['electronico', 'telefono', 'tv']);
        setBrands(['Apple', 'Samsung', 'Sony']);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validations can be more complex based on requirements
            if (!category) {
                throw new Error('Please select a category');
            }
            if (!brand) {
                throw new Error('Please select a brand');
            }

            // Example fetch call
            const response = await fetch(`http://localhost:3001/products/filter/${startPrice}/${endPrice}/${startRating}/${endRating}/${category}/${brand}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            if (data.length === 0) {
                throw new Error('No products with such filters have been found');
            }
            setFilteredProducts(data);
            setGeneralError('');
        } catch (error) {
            console.error('Error filtering products:', error);
            setGeneralError(error.message);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="AdvancedFilter">
            <form onSubmit={handleSubmit} className="filter-form">
                <div className="filter-group">
                    <label>Start Price: ${startPrice}</label>
                    <input type="range" min="0" max="1000" value={startPrice} onChange={(e) => setStartPrice(e.target.value)} />
                </div>
                <div className="filter-group">
                    <label>End Price: ${endPrice}</label>
                    <input type="range" min="0" max="1000" value={endPrice} onChange={(e) => setEndPrice(e.target.value)} />
                </div>
                <div className="filter-group">
                    <label>Rating: {startRating} to {endRating}</label>
                    <input type="range" min="1" max="5" value={startRating} onChange={(e) => setStartRating(e.target.value)} />
                    <input type="range" min="1" max="5" value={endRating} onChange={(e) => setEndRating(e.target.value)} />
                </div>
                <div className="filter-group">
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Brand:</label>
                    <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                        <option value="">Select Brand</option>
                        {brands.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading}>Filter Products</button>
            </form>
            {generalError && <p className="error">{generalError}</p>}
            {loading && <p>Loading...</p>}
            {filteredProducts.length > 0 && (
                <div>
                    <h2>Filtered Products</h2>
                    <ul>
                        {filteredProducts.map(product => (
                            <li key={product.id}>{product.product}
                            <p>price: {product.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AdvancedFilter;
