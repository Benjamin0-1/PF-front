import React, { useState, useEffect } from "react";
import advancedfiltercss from './module.AdvancedFilters.css'; 
import { Link } from 'react-router-dom';

import { 
    Grid, Card, CardContent, Typography, Button, FormControl, InputLabel, Select, MenuItem, Slider, Box, CircularProgress
} from "@mui/material";


function AdvancedFilter() {
    const [startPrice, setStartPrice] = useState(0);
    const [endPrice, setEndPrice] = useState(500);
    const [startRating, setStartRating] = useState(1);
    const [endRating, setEndRating] = useState(5);
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [generalError, setGeneralError] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const responses = await Promise.all([
                    fetch('http://localhost:3001/all-category'),
                    fetch('http://localhost:3001/allbrands'),
                    fetch('http://localhost:3001/allproducts')
                ]);

                if (responses.some(response => !response.ok)) {
                    throw new Error('Failed to fetch data from one or more endpoints');
                }

                const [categoriesData, brandsData, productsData] = await Promise.all(responses.map(res => res.json()));

                setCategories(categoriesData.map(cat => ({ id: cat.id, name: cat.category })));
                setBrands(brandsData.map(brand => ({ id: brand.id, name: brand.brand })));
                setFilteredProducts(productsData);
            } catch (error) {
                console.error('Error loading data:', error);
                setGeneralError('Failed to load initial data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!category || !brand) {
                throw new Error('Please select both a category and a brand');
            }

            const response = await fetch(`http://localhost:3001/products/filter/${startPrice}/${endPrice}/${startRating}/${endRating}/${category}/${brand}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch filtered products');
            }

            const data = await response.json();
            if (data.length === 0) {
                throw new Error('No products found with the selected filters');
            }
            setFilteredProducts(data);
            setGeneralError('');
        } catch (error) {
            console.error('Error filtering products:', error);
            setGeneralError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <Typography gutterBottom>Start Price: ${startPrice}</Typography>
                        <Slider value={startPrice} onChange={(e, newValue) => setStartPrice(newValue)} min={0} max={1000} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography gutterBottom>End Price: ${endPrice}</Typography>
                        <Slider value={endPrice} onChange={(e, newValue) => setEndPrice(newValue)} min={0} max={1000} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography gutterBottom>Rating: {startRating} to {endRating}</Typography>
                        <Slider value={startRating} onChange={(e, newValue) => setStartRating(newValue)} min={1} max={5} />
                        <Slider value={endRating} onChange={(e, newValue) => setEndRating(newValue)} min={1} max={5} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Brand</InputLabel>
                            <Select
                                value={brand}
                                label="Brand"
                                onChange={(e) => setBrand(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {brands.map((b) => (
                                    <MenuItem key={b.id} value={b.name}>{b.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            Filter Products
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {generalError && <Typography color="error">{generalError}</Typography>}
            {loading && <CircularProgress />}
            {filteredProducts.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                    {filteredProducts.map(product => (
                        <Card key={product.id} sx={{ marginBottom: 2 }}>
                            <Link to={`/detail/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.product}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Price: ${product.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Stock: {product.stock === 0 ? 'Out of Stock' : product.stock}
                                    </Typography>
                                   
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default AdvancedFilter;
// <img src={product.image} alt={product.product} style={{ width: '20%', height: 'auto' }} />