import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
}
