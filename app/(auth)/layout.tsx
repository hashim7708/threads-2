import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import React from "react";
import "../globals.css";
import { dark } from "@clerk/themes";
export const metadata = {
  title: "Threads",
  description: "This is thread by next js",
};
const inter = Inter({ subsets: ["latin"] });
interface Props {
  children: React.ReactNode;
}
const layout = ({ children }: Props) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>{children} </body>
      </html>
    </ClerkProvider>
  );
};

export default layout;
