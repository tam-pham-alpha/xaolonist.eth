import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import { Container } from "./Grid";

const ScMain = styled.footer`
  font-size: 16px;
  color: #d6d7dc;
  background: #0b0b0f;
  padding-top: 100px;
  padding-bottom: 48px;

  a {
    color: #d6d7dc;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: white;
    }

    &:active {
      color: #d6d7dc;
    }
  }
`;

const ScContent = styled.div`
  @media screen and (min-width: 992px) {
    display: flex;
    align-items: center;
  }
`;

export const Footer = () => {
  return (
    <ScMain>
      <Container>
        <ScContent>
          <div>
            @2023 • <Link to="/">anh4gs</Link> •{" "}
            <Link to="/aethery">aethery</Link>
          </div>
        </ScContent>
      </Container>
    </ScMain>
  );
};
