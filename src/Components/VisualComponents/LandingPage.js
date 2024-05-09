import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Parallax } from 'react-parallax';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { motion } from 'framer-motion';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background: #121212;
    color: white;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

const HeroSection = styled.div`
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const HeroTitle = styled(motion.h1)`
  color: #00ffea;
  font-size: 48px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ProductCard = styled(motion.div)`
  padding: 10px;
  border-radius: 10px;
  background: #222;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const ProductImage = styled.img`
  width: 100%;
  border-radius: 5px;
`;

const ProductName = styled.h3`
  color: #00ffea;
`;

const ProductPrice = styled.p`
  color: #ccc;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px 0;
  background-color: #0f0c29;
  color: #00ffea;
  border-top: 3px solid #00ffea;
`;

const responsiveCarousel = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const GamingLanding = () => {
  const backgroundImages = [
   
    
    "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6562/6562576_sd.jpg"
    // mas imagenes
    
  ];

  const products = [
    { id: 1, name: 'Gaming Laptop', price: '$999', imageUrl: 'https://i5.walmartimages.com/seo/Sony-PlayStation-4-Limited-Edition-game-console-HDR-1-TB-HDD-gold_550d58ac-1b7c-4459-8d23-e23fd4b6f8e2_1.f50649af449335c03d864a4744bceee1.jpeg' },
    { id: 2, name: 'Gaming Monitor', price: '$399', imageUrl: 'https://www.mundodeportivo.com/alfabeta/hero/2024/03/ps5-pro-concepto.1710751857.9833.jpg?width=768&aspect_ratio=16:9&format=nowebp' },
    { id: 3, name: 'Gaming Chair', price: '$249', imageUrl: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6562/6562576_sd.jpg' },
    {id: 4, name: 'nintendo', price: '299.99', imageUrl: 'https://media.wired.com/photos/615cb6377aac0c0d8e7cfb3f/191:100/w_1280,c_limit/Gear-Nintendo-Switch-OLED.jpg'}
  ];

  return (
    <>
      <GlobalStyle />
      <Parallax strength={300} bgImage={backgroundImages[0]}>
        <HeroSection>
          <HeroTitle
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Experience the Edge of Technology
          </HeroTitle>
        </HeroSection>
      </Parallax>
      <Container>
        <h2>Featured Products</h2>
        <Carousel responsive={responsiveCarousel} autoPlay={true} autoPlaySpeed={3000} infinite={true}>
          {products.map(product => (
            <ProductCard key={product.id}>
              <ProductImage src={product.imageUrl} alt={product.name} />
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price}</ProductPrice>
            </ProductCard>
          ))}
        </Carousel>
      </Container>
      <Footer>
        © 2024 Electronic Tech E-commerce. All rights reserved.
      </Footer>
    </>
  );
};

export default GamingLanding;
