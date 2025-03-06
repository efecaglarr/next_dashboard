import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import StoreProvider from "@/state/store";
// import "./globals.css";
// import DashboardWrapper from "./dashboard/dashboardWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fullfilment by us",
  description: "Your partner for amazon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
