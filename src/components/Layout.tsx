import React from "react";

import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

import "../css/global.css";

export const Layout = ({ children, blur, lang }: React.PropsWithChildren<{blur: boolean; lang?: string}>) => {
  return (
    <main>
      <NavBar blur={blur} lang={lang} />
      {children}
      <Footer lang={lang} />
    </main>
  );
};
