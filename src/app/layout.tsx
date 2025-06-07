import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/auth-context";
import { SidebarProvider } from "@/context/sidebar-context";
import LayoutWrapper from "./layout-wrapper";
import Sidebar from "./sidebar";

const montserrat = Montserrat({
  variable: "--montserrat",
  subsets: ["latin-ext"],
});

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
      <body className={`${montserrat.variable} antialiased min-h-screen w-full flex`}>
        <AuthProvider>
          <SidebarProvider>
            <ToastContainer />
            <LayoutWrapper>
              <Sidebar />
                {children}
            </LayoutWrapper>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
