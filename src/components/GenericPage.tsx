import React from "react";
import App from "App";

function GenericPage({ children }: { children: React.ReactNode }) {
  return <App>{children}</App>;
}

export default GenericPage;
