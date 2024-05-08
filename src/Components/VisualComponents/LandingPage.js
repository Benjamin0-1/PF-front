import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


// Global style for body
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
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
  background: url(https://cdn.mos.cms.futurecdn.net/6t8Zh249QiFmVnkQdCCtHK.jpg) center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: #00ffea;
  font-size: 48px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ProductCard = styled.div`
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

const GamingLanding = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
  };

  return (
    <>

      <GlobalStyle />
      <HeroSection>
        <HeroTitle>Experience the Edge of Technology</HeroTitle>
      </HeroSection>
      <Container>
        <h2>Featured Products</h2>
        <Slider {...settings}>
          <ProductCard>
            <ProductImage src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" width="300" height="200" />
            <ProductName>Razer Huntsman V2</ProductName>
            <ProductPrice>$249.99</ProductPrice>
          </ProductCard>
          <ProductCard>
            <ProductImage src="https://e7.pngegg.com/pngimages/199/713/png-clipart-laptop-razer-blade-stealth-13-razer-blade-14-intel-core-computer-razor-blade-drawing-netbook-computer.png" width="300" height="200" />
            <ProductName>Razer Naga X</ProductName>
            <ProductPrice>$79.99</ProductPrice>
          </ProductCard>
          <ProductCard>
            <ProductImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQCFin2zDtbqYExLFc7XZ0lc2KiZTzr8ULmoM7X3GlGw&s" width="300" height="200" />
            <ProductName>Razer DeathAdder V2 Pro</ProductName>
            <ProductPrice>$129.99</ProductPrice>
          </ProductCard>
        </Slider>
      </Container>
      <Footer>
        © 2024 Electronic Tech E-commerce. All rights reserved.
      </Footer>
    </>
  );





};

export default GamingLanding;
