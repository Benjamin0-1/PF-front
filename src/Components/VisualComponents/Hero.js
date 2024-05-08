import React from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('https://source.unsplash.com/random/1920x1080?tech') center/cover no-repeat;
`;

const Title = styled(animated.div)`
  font-size: 48px;
  color: white;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(0,0,0,0.5);
`;

const HeroSection = () => {
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 500 });

  return (
    <Wrapper>
      <Title style={props}>Welcome to Your Tech Store</Title>
    </Wrapper>
  );
};

export default HeroSection;
