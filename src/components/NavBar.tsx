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
  justify-content: space-between;
  height: 64px;
`;

const ScNavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ScNavLink = styled(Link)`
  color: var(--text-color);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    text-decoration: none;
  }
`;

const ScNavLinkBlur = styled(ScNavLink)`
  opacity: 0.3;

  &:hover {
    opacity: 0.6;
  }
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

const ScLangSwitcher = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  a {
    font-size: 1.2rem;
    line-height: 1;
    text-decoration: none !important;
    opacity: 0.3;
    filter: grayscale(100%);
    transition: all 0.3s;

    &:hover {
      opacity: 1;
      filter: none;
      text-decoration: none !important;
    }

    &.active {
      opacity: 0.5;
      filter: none;
      pointer-events: none;
      cursor: default;
    }
  }
`;

export const NavBar = ({ blur, lang }: { blur?: boolean; lang?: string }) => {
  const isEn = lang === "en";
  const viPath = typeof window !== "undefined" ? window.location.pathname.replace(/^\/en/, "") || "/" : "/";
  const enPath = typeof window !== "undefined" ? `/en${window.location.pathname.replace(/^\/en/, "")}` : "/en/";

  return (
    <>
      <ScHeader>
        <Container>
          <ScNavBar>
            {blur ? (
              <ScLogoBlur to={isEn ? "/en/" : "/"}>
                <img src="/images/icon.png" loading="eager" alt="logo" />
                <span>anh4gs</span>
              </ScLogoBlur>
            ) : (
              <ScLogo to={isEn ? "/en/" : "/"}>
                <img src="/images/icon.png" loading="eager" alt="logo" />
                <span>anh4gs</span>
              </ScLogo>
            )}

            <ScNavLinks>
              {blur ? (
                <>
                  <ScNavLinkBlur to={isEn ? "/en/" : "/"}>bnvc</ScNavLinkBlur>
                  <ScNavLinkBlur to={isEn ? "/en/dvvv" : "/dvvv"}>dvvv</ScNavLinkBlur>
                  <ScLangSwitcher>
                    <Link to={viPath} className={!isEn ? "active" : ""} title="Tiếng Việt">🇻🇳</Link>
                    <Link to={enPath} className={isEn ? "active" : ""} title="English">🇬🇧</Link>
                  </ScLangSwitcher>
                </>
              ) : (
                <>
                  <ScNavLink to={isEn ? "/en/" : "/"}>bnvc</ScNavLink>
                  <ScNavLink to={isEn ? "/en/dvvv" : "/dvvv"}>dvvv</ScNavLink>
                  <ScLangSwitcher>
                    <Link to={viPath} className={!isEn ? "active" : ""} title="Tiếng Việt">🇻🇳</Link>
                    <Link to={enPath} className={isEn ? "active" : ""} title="English">🇬🇧</Link>
                  </ScLangSwitcher>
                </>
              )}
            </ScNavLinks>
          </ScNavBar>
        </Container>
      </ScHeader>

      <div style={{ height: 64 }}></div>
    </>
  );
};
