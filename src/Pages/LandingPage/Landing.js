import React from 'react';
import { Link } from "react-router-dom"
import Carousel from '../../Components/Carousel/Carousel';
import styles from './Landing.module.css';
const image1 = "https://st2.depositphotos.com/1760420/5432/i/450/depositphotos_54324565-stock-photo-online-shopping-and-e-commerce.jpg";

const Landing = () => {
  const carousel1Images = [ image1, image1, image1 ];
  const carousel2Images = [ "https://i.pinimg.com/originals/ef/80/83/ef8083bfe79088dc00bd8eca9c821cd5.jpg", "https://www.trashedgraphics.com/wp-content/uploads/2014/02/banner_02.jpg", "https://www.fiercepc.co.uk/media/wysiwyg/LAPTOP-NEW.jpg" ];
  const carousel3Images = [ "https://www.olier.com.py/storage/categorias/imagen-banner-hero98-1-1657289795.png", "https://www.gear.cl/img/banner-tv.png", "https://www.daiwa.in/wp-content/uploads/2021/12/new-tv-launch-banner-2.jpg" ];


  return (
    <div className={ styles.container }>

      <div className={ styles.imageAndDescription }>
        <img src="https://static.vecteezy.com/system/resources/previews/002/478/302/original/sale-electronics-banner-background-free-vector.jpg" className={ styles.intermediateImage } alt="" />
      </div>
      {/* Carruseles */ }
      <div className={ styles.landing_card }>
        <Link className={ styles.landing_card_img_container }>
          <img src="https://mikeshouts.com/wp-content/uploads/2014/06/Icon-Q-Boundless-H3-Bluetooth-Headphones-image-2-630x354.jpg" alt="" />
          <h1>Auriculares</h1>
        </Link>
        <p className={ styles.description }>
          Lleva tu musica atodos lados, con los mejores <span><Link>auriculares</Link></span>
        </p>
      </div>
      <div className={ styles.landing_card }>
        <Link className={ styles.landing_card_img_container }>
          <img src="https://th.bing.com/th/id/R.b38d2aa256df5fb28eb6bdb8a128e7de?rik=Lrwzv%2fN8Qmlhag&pid=ImgRaw&r=0" alt="" />
          <h1>Celulares</h1>
        </Link>
        <p className={ styles.description }>
          Mantente conectado, con los mejores <span><Link>telefonos celulares</Link></span>
        </p>
      </div>
      <div className={ styles.carouselContainer }>
        <Carousel images={ carousel2Images } />
      </div>
      <div className={ styles.carousel_text }>

        <p className={ styles.description }>
          Lleva tu juego a otro nivel, con las mejores <span>Laptops</span> del mercado
        </p>
      </div>
      <div className={ styles.carouselContainer }>
        <Carousel images={ carousel3Images } />
      </div>
      <div className={ styles.carousel_text }>
        <p className={ styles.description }>
          Lleva el cine a tu casa y disfruta de los colores mas vivos y la mejor calidad de audio con los mejores <span>Televisores</span>
        </p>
      </div>
    </div>
  );
};

export default Landing;