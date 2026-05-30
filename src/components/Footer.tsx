import React from "react";
import { Link } from "gatsby";

import { Container } from "./Grid";

export const Footer = ({ lang }: { lang?: string }) => {
  const linkClass = "text-[#d6d7dc] no-underline hover:text-white active:text-[#d6d7dc] transition-colors duration-200";

  return (
    <footer className="text-base text-[#d6d7dc] bg-[#0b0b0f] pt-[100px] pb-12">
      <Container>
        <div className="lg:flex lg:items-center">
          <div>
            @2023 • <Link to={lang === "en" ? "/en/" : "/"} className={linkClass}>anh4gs</Link> •{" "}
            <Link to={lang === "en" ? "/en/aethery" : "/aethery"} className={linkClass}>aethery</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
