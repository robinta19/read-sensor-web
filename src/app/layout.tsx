import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export const metadata: Metadata = {
  title: "Web Read Sensor",
  description: "Web Read Sensor",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
