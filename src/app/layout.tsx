import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Importador - eNube",
  description: "Importador de dados para o eNube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
