import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ handleFilter }) => {
    const [priceBigger, setPriceBigger] = useState('');
    const [priceLess, setPriceLess] = useState('');
    const [priceStart, setPriceStart] = useState('');
    const [priceEnd, setPriceEnd] = useState('');
    const [category, setCategory] = useState('');

    const handleSearchByPriceBigger = () => {
        if (priceBigger !== '') {
            handleFilter(`/searchbypricebigger/${priceBigger}`);
        }
    };

    const handleSearchByPriceLess = () => {
        if (priceLess !== '') {
            handleFilter(`/searchbypriceless/${priceLess}`);
        }
    };

    const handleSearchByPriceRange = () => {
        if (priceStart !== '' && priceEnd !== '') {
            handleFilter(`/searchbypricerange/${priceStart}/${priceEnd}`);
        }
    };

    const handleFilterByCategory = () => {
        if (category !== '') {
            handleFilter(`/category/${category}`);
        }
    };

    return (
        <div className="filter-options">
            <h3>Filters</h3>
            <ul>
                <li>
                    <input
                        type="number"
                        placeholder="Price bigger than"
                        value={priceBigger}
                        onChange={(e) => setPriceBigger(e.target.value)}
                    />
                    <button onClick={handleSearchByPriceBigger}>Search by Price Bigger</button>
                </li>
                <li>
                    <input
                        type="number"
                        placeholder="Price less than"
                        value={priceLess}
                        onChange={(e) => setPriceLess(e.target.value)}
                    />
                    <button onClick={handleSearchByPriceLess}>Search by Price Less</button>
                </li>
                <li>
                    <input
                        type="number"
                        placeholder="Price start"
                        value={priceStart}
                        onChange={(e) => setPriceStart(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Price end"
                        value={priceEnd}
                        onChange={(e) => setPriceEnd(e.target.value)}
                    />
                    <button onClick={handleSearchByPriceRange}>Search by Price Range</button>
                </li>
                <li>
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <button onClick={handleFilterByCategory}>Filter by Category</button>
                </li>
                {/* Add more filtering options as needed */}
            </ul>
        </div>
    );
};

export default Filter;
