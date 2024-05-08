import React from 'react';
import Slider from "react-slick";
import styled from 'styled-components';

const ProductCard = styled.div`
  width: 100%;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  background-color: #222;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  &:hover {
    transform: scale(1.05);
    transition: transform .2s;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const ProductName = styled.h3`
  margin-top: 10px;
  color: #00ffea;
`;

const ProductPrice = styled.p`
  color: #ccc;
`;

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  cssEase: "linear"
};

const FeaturedProducts = () => {
  return (
    <div style={{ margin: '20px' }}>
      <Slider {...settings}>
        <ProductCard>
          <ProductImage src="https://source.unsplash.com/random/200x200?sig=1&gaming" alt="Product 1" />
          <ProductName>Gaming Keyboard</ProductName>
          <ProductPrice>$199.99</ProductPrice>
        </ProductCard>
        {/* Repeat for other products */}
      </Slider>
    </div>
  );
};

export default FeaturedProducts;
