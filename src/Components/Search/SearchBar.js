import style from "./SearchBar.module.css"
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom";
import { serachProduct } from "../../redux/actionProducts";
import searchIcon from "../../assets/searchIcon.png"

export default function SearchBar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ name, setName ] = useState('');
    const [ resultsOpen, setResultsOpen ] = useState(false);
    const [ results, setResults ] = useState({});
    const [ noProductSearchError, setNoProductSearchError ] = useState('');
    const [ foundProduct, setFoundProduct ] = useState([]);
    const resultsSearch = useSelector(state => state.products.resultsSearch)
    // const error = useSelector(state => state.products.errorMessage)

    function handleInputChange(e) {
        e.preventDefault()
        setName(e.target.value)
    }
    useEffect(() => {
        if (name) {
            dispatch(serachProduct(name))
            setResultsOpen(true)
            return
        } else if (!name.length) {
            setResultsOpen(false)
            return
        }
    }, [ dispatch, name, resultsSearch ]);

    const handleCloseResults = () => {
        setResultsOpen(false)
        setName("")
    }


    return (
        <div className={ style.searchBar }>
            <form className={ style.searchBar_container }>
                <input
                    type="search"
                    value={ name }
                    placeholder="Busca tus articulos aqui:"
                    label="Search"
                    onChange={ handleInputChange }
                />
                <div className={ style.searchBar_button } type="submit" ><img src={ searchIcon } alt="" /></div>
            </form>
            <div className={ `${style.searchBar_results_container} ${resultsOpen && style.results_open}` }>
                <button onClick={ handleCloseResults }>X</button>
                { resultsSearch?.length ? resultsSearch.map(r => (
                    <Link key={ r.id } to={ `/detail/${r.id}` }>
                        <div className={ style.search_results_card }>
                            <div className={ style.results_image }>
                                <img src={ r.image } alt={ r.id } />
                            </div>
                            <div className={ style.results_info }>
                                <h3>{ r.product }</h3>
                                <p>{ r.price }</p>
                            </div>
                        </div>
                    </Link>
                )) : "Search a product..." }
            </div>
        </div>
    )
}
