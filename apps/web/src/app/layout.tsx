import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Shopify Insights - Enterprise Analytics Platform",
    description: "Transform your Shopify data into actionable insights with real-time analytics and comprehensive reporting.",
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body className={inter.className} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
