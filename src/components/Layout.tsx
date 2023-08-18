import React from "react";
import { createGlobalStyle } from "styled-components";

import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

import "../css/normalize.css";

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    line-height: 1.5em;
    font-weight: 400;
    font-style: normal;
    letter-spacing: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    background-color: #0B0B0F;
    color: white;
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Inter", sans-serif;
  }

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  a {
    text-decoration: none;
    color: white;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Layout = ({ children, blur }: React.PropsWithChildren<{blur: boolean}>) => {
  return (
    <main>
      <GlobalStyle />
      <NavBar blur={blur} />
      {children}
      <Footer />
    </main>
  );
};
