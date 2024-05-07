import React from "react";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'; //notificaciones
// import { Rating } from "@mui/material";
// import { getCategories } from "../../redux/actionsCategories";
// import { addCartProduct, addCartProductGuest, cleanReview, getCart, getProductById, getReviewsProduct, cleanDetail } from "../../redux/actionsProducts";
import style from './Detail.module.css'
import { addProductCart, getProductById } from "../../redux/actionProducts";


export default function ProductDetail() {

    let { id } = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const detailProduct = useSelector((state) => state.products.detailProduct)

    //const reviewsProduct = useSelector((state) => state.products.reviews)
    // const user = useSelector((state)=>state.users.userInfo)

    const accesToken = localStorage.getItem("accessToken")

    useEffect(() => {
        dispatch(getProductById(id))

        /* return () => {
             dispatch(cleanDetail()) 
             
         }*/
    }, [ id, dispatch ])


    //al hacer click en comprar se añade al carrito del usuario y si 
    //no esta logeado se envia al carrito de invitado 
    // function handleBuy(e, productId) {
    //     e.preventDefault();
    //     if(accesToken){
    //         dispatch(addCartProduct({
    //             userId: user.id,
    //             productId: productId,
    //             bundle: 1
    //         }))
    //         toast.success("Product added to cart!", {
    //             position: toast.POSITION.BOTTOM_RIGHT
    //         });
    //         navigate('/cart')
    //         dispatch(getCart(user.id))
    //     }
    //     else {
    //         dispatch(addCartProductGuest(productId))
    //         toast.success("Product added to cart!", {
    //             position: toast.POSITION.BOTTOM_RIGHT
    //         });
    //         navigate('/cart')
    //     }
    // }

    // const stockItems = []
    // for (var i = 1; i <= detailProduct.stock; i++) {
    //     stockItems.push(i)
    // }



    return (
        <>

            { detailProduct &&


                (<div className={ style.card_container }>
                    <div className={ style.card }>
                        <div className={ style.card_img }>
                            <img src={ detailProduct.image } alt="" />
                        </div>
                        <div className={ style.card_data }>
                            <Link to={ "/home" }>
                                <button className={ style.btnHome }>X</button>
                            </Link>



                            { detailProduct.Categories?.map(category => {
                                return (
                                    <span key={ category.id }>{ category.category }</span>
                                )
                            }) }

                            <h3>{ detailProduct.product }</h3>
                            <h4>${ detailProduct.price }</h4>
                            {/* <Rating readOnly value={detailProduct.rating} /> */ }


                            <div className={ style.desc }>
                                <p>Description: { detailProduct.description }</p>
                                <p>Characteristics: { detailProduct.attributes }</p>
                            </div>
                            {
                                detailProduct.stock === 0 ?
                                    <div>
                                        <h2>Product out of stock</h2>
                                    </div>
                                    :
                                    <div>
                                        <h5>{ detailProduct.stock } Available!</h5>
                                    </div>
                            }
                            <button onClick={ () => dispatch(addProductCart({ image: detailProduct.image, product: detailProduct.product, price: detailProduct.price, description: detailProduct.description, id: detailProduct.id })) }
                                disabled={ detailProduct.stock === 0 }
                                className={ style.buyBtn }>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <div>
                        {
                            detailProduct.Review ?
                                <div>
                                    {
                                        detailProduct.Review.map(review => {
                                            return (
                                                <div key={ review.id } >
                                                    <p>{ review.review }</p>
                                                    <p>Rating: { review.rating }</p>
                                                    <p>Review Date: { review.reviewDate }</p>
                                                    <br></br>
                                                </div>
                                            )
                                        })
                                    }</div> :
                                <div></div>
                        }
                    </div>

                </div>
                ) }
        </>
    )
}
