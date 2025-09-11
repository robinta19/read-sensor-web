import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Providers from "./providers";
import { MyAlertDialog } from "@/components/ui/customAlertDialog";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kualitas Air Mangrove Petengoran, Desa Gebang, Pesawaran",
  description: "Kualitas Air Mangrove Petengoran, Desa Gebang, Pesawaran",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
       <head>
         <link rel="icon" href="/images/logo-nav.png" />
      </head>
      <body className={`bg-[#F5F5F5] ${poppins.className} antialiased`}>
        <Providers>{children}</Providers>
        <MyAlertDialog />
      </body>
    </html>
  );
}
