import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Footer = () => {
  return (
    <FooterContainer>
      © 2024 Your Tech Store, Inc.
    </FooterContainer>
  );
};

export default Footer;
