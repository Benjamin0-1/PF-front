// IMPORTANTE: Rating aun no existe en la version de Heroku.

import React, {useState} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth"; // <-- verificar el camino en tu PC.
import './CreateReview.css'; // estilos

const accessToken = localStorage.getItem('accessToken');

const PORT = process.env.PORT || 3001; // <-- esto funciona en localhost y heroku.
//const URL  = `https://proyecto-final-backend-0e01b3696ca9.herokuapp.com:${PORT}/review`; // <-- luego modificar para heroku, PORT debe quedarse igual.
const URL  = `https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/review`;

const BRAND_DETAIL = 'https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/allbrands'; // <-- para ver las marcas y su id, mejorando la experiencia de admin dashboard.

function CreateReview() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');
    const [invalidRatingError, setInvalidRatingError] = useState(''); // <-- verificar que rating sea un numero o float entre 1 y 5.
    const [selectProduct, setSelectProduct] = useState(''); // <-- para seleccionar el producto y dejar la review.
    const [productNotFoundError, setProductNotFoundError] = useState('');

    // aqui se puede verificar que usuario este loggeado y sea admin.
    if (!accessToken) {
        window.location.href = '/login'
    };

    

    const handleCreation = async () => {
        try {
            
            const ratingRegex = /^[1-5](\.[0-9])?$/; // <-- verificar numero de rating.
            if (!ratingRegex.test(rating)) {
                setInvalidRatingError('El rating debe ser un numero decimal entre 1 y 5');
                setGeneralError('');
                setSuccessMessage('');
                return;
            } 
            
            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({review, productId: selectProduct, rating}) // se quita rating
            });

            if (response.status === 404) {
                setProductNotFoundError(`No se ha encontrado el producto con id: ${selectProduct}`);
                setGeneralError('');
                setInvalidRatingError('');
                setSuccessMessage('');
            };

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                setSuccessMessage('');
                setInvalidRatingError('');
                return;
            };

            setSuccessMessage('Review creada con exito');
            setGeneralError('');
            setInvalidRatingError('');

        } catch (error) {
            console.log(`Error: ${error}`);
            setGeneralError('Ha ocurrido un error')
            setInvalidRatingError('');
            setSuccessMessage('');
        };
    };

    
    return (
        <div className="create-review-container">
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Escribe tu review aquí"
                className="review-textarea"
            ></textarea>
            <input
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Calificación (1-5)"
                className="rating-input"
            />
            <input
                type="text"
                value={selectProduct}
                onChange={(e) => setSelectProduct(e.target.value)}
                placeholder="ID de producto a calificar."
                className="rating-input"
            />

            <button onClick={handleCreation} className="create-button">Crear Review</button>
            {generalError && <p className="error-message">{generalError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {productNotFoundError && <p className="error-message">{productNotFoundError}</p>}
            {invalidRatingError && <p className="error-message">{invalidRatingError}</p>}
        </div>
    );
}





export default CreateReview;
