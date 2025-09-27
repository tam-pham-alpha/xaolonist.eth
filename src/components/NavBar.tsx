import React from "react";
import styled, { css } from "styled-components";
import { Link } from "gatsby";

import { Container } from "./Grid";

const ScHeader = styled.header`
  font-family: "Inter", sans-serif;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 98;
  background: #0b0b0f;

  background: #000000; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #0b0b0f,
    #000000 35%
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #0b0b0f,
    #000000 35%
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const ScNavBar = styled.nav`
  display: flex;
  align-items: center;
  height: 64px;
`;

const ScLogo = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-right: 24px;
  transition: all 0.3s;

  img {
    height: 32px;
    margin-right: 8px;
  }

  &:hover {
    text-decoration: none;
    opacity: 1;

    span {
      opacity: 1;
    }
  }
`;

const ScLogoBlur = styled(ScLogo)`
  opacity: 0.5;

  span {
    opacity: 0.1;
  }
`;

export const NavBar = ({ blur }: { blur?: boolean }) => {
  return (
    <>
      <ScHeader>
        <Container>
          <ScNavBar>
            {blur ? (
              <ScLogoBlur to="/">
                <img src="/images/icon.png" loading="eager" />
                <span>anh4gs</span>
              </ScLogoBlur>
            ) : (
              <ScLogo to="/">
                <img src="/images/icon.png" loading="eager" />
                <span>anh4gs</span>
              </ScLogo>
            )}
          </ScNavBar>
        </Container>
      </ScHeader>

      <div style={{ height: 64 }}></div>
    </>
  );
};
