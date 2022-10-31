import React from "react";
import App from "App";

export function GenericPage({ children }: { children: React.ReactNode }) {
  return <App>{children}</App>;
}
