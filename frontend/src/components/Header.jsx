import React, { PropTypes } from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  background-color: #075E54;
  color: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
`
const Header = ({ children }) => (
  <HeaderContainer>
    {children}
  </HeaderContainer>
);

Header.propTypes = {
  children: PropTypes.string.isRequired,
}

Header.defaultProps = {
}

export default Header
