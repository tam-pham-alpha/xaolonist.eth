import React from "react";
import { Link } from "gatsby";

import { Container } from "./Grid";

export const NavBar = ({ blur, lang }: { blur?: boolean; lang?: string }) => {
  const isEn = lang === "en";
  const viPath = typeof window !== "undefined" ? window.location.pathname.replace(/^\/en/, "") || "/" : "/";
  const enPath = typeof window !== "undefined" ? `/en${window.location.pathname.replace(/^\/en/, "")}` : "/en/";

  const navLinkClass = blur
    ? "text-white font-medium no-underline transition-all duration-300 opacity-30 hover:opacity-60 hover:no-underline"
    : "text-white font-medium no-underline transition-all duration-300 opacity-80 hover:opacity-100 hover:no-underline";

  const logoClass = blur
    ? "flex items-center font-bold mr-6 transition-all duration-300 no-underline hover:no-underline text-white opacity-50 hover:opacity-100 group"
    : "flex items-center font-bold mr-6 transition-all duration-300 no-underline hover:no-underline text-white hover:opacity-100 group";

  const logoSpanClass = blur
    ? "text-white opacity-10 group-hover:opacity-100 transition-all duration-300"
    : "text-white transition-all duration-300";

  const getLangLinkClass = (active: boolean) =>
    active
      ? "text-[1.2rem] leading-none no-underline hover:no-underline opacity-50 grayscale-0 pointer-events-none cursor-default transition-all duration-300"
      : "text-[1.2rem] leading-none no-underline hover:no-underline opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300";

  return (
    <>
      <header className="font-sans fixed left-0 right-0 top-0 z-[98] nav-header w-full">
        <Container>
          <nav className="flex items-center justify-between h-16">
            <Link to={isEn ? "/en/" : "/"} className={logoClass}>
              <img src="/images/icon.png" loading="eager" alt="logo" className="h-8 mr-2" />
              <span className={logoSpanClass}>anh4gs</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to={isEn ? "/en/" : "/"} className={navLinkClass}>bnvc</Link>
              <Link to={isEn ? "/en/dvvv" : "/dvvv"} className={navLinkClass}>dvvv</Link>
              <div className="inline-flex items-center gap-3 cursor-pointer">
                <Link to={viPath} className={getLangLinkClass(!isEn)} title="Tiếng Việt">🇻🇳</Link>
                <Link to={enPath} className={getLangLinkClass(isEn)} title="English">🇬🇧</Link>
              </div>
            </div>
          </nav>
        </Container>
      </header>

      <div className="h-16"></div>
    </>
  );
};

