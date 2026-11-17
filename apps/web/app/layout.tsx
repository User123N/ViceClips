import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VICE CLIPS — VICE ISLAND",
  description: "Gaming stream production command center",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
