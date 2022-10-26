import * as React from "react";
import { HeadFC, Link } from "gatsby";

const PageStyles = {
  color: "#232129",
  padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const HeadingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

const ParagraphStyles = {
  marginBottom: 48,
};
const CodeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
};

function NotFoundPage() {
  return (
    <main style={PageStyles}>
      <h1 style={HeadingStyles}>Page not found</h1>
      <p style={ParagraphStyles}>
        Sorry 😔, we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === "development" ? (
          <>
            <br />
            Try creating a page in <code style={CodeStyles}>src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/">Go home</Link>.
      </p>
    </main>
  );
}

export default NotFoundPage;

// eslint-disable-next-line react/function-component-definition
export const Head: HeadFC = () => <title>Not found</title>;
