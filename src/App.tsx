import React from "react";
import { Helmet } from "react-helmet";
import localFonts from "fonts";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, Theme } from "Theme";
import "sanitize.css";

function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={Theme}>
      <Helmet defer={false}>
        <style>{localFonts}</style>
      </Helmet>

      <GlobalStyles />

      {children}
    </ThemeProvider>
  );
}

export default App;
