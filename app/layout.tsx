import type { ReactNode } from "react";
import "./globals.css";

/** Root pass-through — locale layout owns <html>/<body>. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
