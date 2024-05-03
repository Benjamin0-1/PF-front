import style from "./SearchBar.module.css"
import React, { useEffect } from "react";
import { useState } from "react";
// import { useDispatch, useSelector } from 'react-redux'
// import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
// import { searchProductName } from "../../redux/actionsProducts";

export default function SearchBar() {
    // const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ name, setName ] = useState('');
    const [ resultsOpen, setResultsOpen ] = useState(false);
    const [ results, setResults ] = useState({});
    const [ noProductSearchError, setNoProductSearchError ] = useState('');
    const [ foundProduct, setFoundProduct ] = useState([]);
    // const searchResults = useSelector(state => state.products.searchProduct)
    // const error = useSelector(state => state.products.errorMessage)

    function handleInputChange(e) {
        e.preventDefault()
        setName(e.target.value)
    }

    // useEffect(() => {
    //     setResults(searchResults)
    //     console.log(error)
    //     console.log(results)
    // }, [ searchResults, error, results ]);

    // function handleSearch(e) {
    //     e.preventDefault()
    //     if (name) {
    //         // dispatch(searchProductName(name));
    //         setResults(searchResults)
    //         setResultsOpen(true);
    //     } else {
    //         toast.warning("Escribe el producto que quieres buscar!", {
    //             position: toast.POSITION.TOP_RIGHT
    //         });
    //     }
    // }
    const handleSearch = async (e) => {
        e.preventDefault();
        try {

            const response = await fetch(`http://localhost:3001/search/product/${name}`);


            if (response.status === 404) {
                setResultsOpen(true)
                setNoProductSearchError(`No existe producto con el nombre: ${name}`);
                return;
            };


            const data = await response.json();
            setFoundProduct(data);

            const productId = data.products[ 0 ].id;
            console.log(`Product id: ${productId}`);
            window.location.href = `/detail/${productId}`


        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    return (
        <div className={ style.searchBar }>
            <form onSubmit={ handleSearch } className={ style.searchBar_container }>
                <input
                    type="search"
                    value={ name }
                    placeholder="Busca tus articulos aqui:"
                    label="Search"
                    onChange={ handleInputChange }
                />
                <button type="submit" >Search</button>
            </form>
            <div className={ `${style.searchBar_results_container} ${resultsOpen && style.results_open}` }>
                <button onClick={ () => setResultsOpen(false) }>X</button>
                {/* { results && (
                    <Link to={ `/detail/${results.id}` }>
                        <div className={ style.search_results_card }>
                            <div className={ style.results_image }>
                                <img src={ results.image } alt={ results.product } />
                            </div>
                            <div className={ style.results_info }>
                                <p>{ results.product }</p>
                                <p>{ results.price }</p>
                            </div>
                        </div>
                    </Link>
                ) } */}
                { noProductSearchError && <p style={ { color: 'red' } }>{ noProductSearchError }</p> }
                { foundProduct.length > 0 && (
                    <div className="found-product">
                        <h2>{ foundProduct[ 0 ].product }</h2>
                        <p>{ foundProduct[ 0 ].description }</p>
                    </div>
                ) }
            </div>
        </div>
    )
}
