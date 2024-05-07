import React, { useState } from "react";

function AdvancedFilter() {
    const [startPrice, setStartPrice] = useState('');
    const [endPrice, setEndPrice] = useState('');
    const [startRating, setStartRating] = useState('');
    const [endRating, setEndRating] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startPrice') {
            setStartPrice(value);
        } else if (name === 'endPrice') {
            setEndPrice(value);
        } else if (name === 'startRating') {
            setStartRating(value);
        } else if (name === 'endRating') {
            setEndRating(value);
        } else if (name === 'category') {
            setCategory(value);
        } else if (name === 'brand') {
            setBrand(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (category.length < 2) {
                setGeneralError('Enter a valid category');
                return;
            }

            if (brand.length < 2) {
                setGeneralError('Enter a valid brand name');
                return;
            }

            const response = await fetch(`http://localhost:3001/products/filter/${startPrice}/${endPrice}/${startRating}/${endRating}/${category}/${brand}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();

            if (data.length === 0) {
                setGeneralError('No products with such filters have been found');
                setFilteredProducts([]);
                return
            }


            setFilteredProducts(data)

        } catch (error) {
            console.error('Error filtering products:', error);
            setGeneralError('Error filtering products. Please try again later.');
            setFilteredProducts([]);
        }

        setLoading(false);
    };

    return (
        <div className="AdvancedFilter" style={{ marginLeft: '200px' }}>
            {console.log(filteredProducts)}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input type="text" name="startPrice" value={startPrice} onChange={handleChange} placeholder="Start Price" style={{ width: 'calc(100% - 80px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                <input type="text" name="endPrice" value={endPrice} onChange={handleChange} placeholder="End Price" style={{ width: 'calc(100% - 80px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                <input type="text" name="startRating" value={startRating} onChange={handleChange} placeholder="Start Rating" style={{ width: 'calc(100% - 80px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                <input type="text" name="endRating" value={endRating} onChange={handleChange} placeholder="End Rating" style={{ width: 'calc(100% - 80px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                <input type="text" name="category" value={category} onChange={handleChange} placeholder="Category" style={{ width: 'calc(100% - 80px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                <input type="text" name="brand" value={brand} onChange={handleChange} placeholder="Brand" style={{ width: 'calc(100% - 80px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Filter Products</button>
            </form>
            {generalError && <p className="error" style={{ color: 'red', marginBottom: '10px' }}>{generalError}</p>}
            {loading && <p style={{ marginBottom: '10px' }}>Loading...</p>}
            {filteredProducts.length > 0 && (
               
                <div>
                    <h2>Filtered Products</h2>
                    <ul>
                        {filteredProducts.map(product => (
                            <li key={product.id}>{product.product}</li>
                            
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AdvancedFilter;
