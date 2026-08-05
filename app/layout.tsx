import Providers from "@/components/Providers";
import "./globals.css"; // 👈 Yeh top line par hona zaroori hai
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 👈 Root components ko Providers ke andar wrap karein */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}