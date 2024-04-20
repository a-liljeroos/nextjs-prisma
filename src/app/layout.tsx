import type { Metadata } from "next";
// auth
import { auth } from "@serverAuth";
import SessionProvider from "@components/SessionProvider/SessionProvider";
// react-query
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@react-query/QueryClient";
// font
import { Inter } from "next/font/google";
// components
import NavBar from "@components/navBar/navBar";
import { Toaster } from "react-hot-toast";
// styles
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
            <NavBar />
            <Toaster />
            {children}
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
