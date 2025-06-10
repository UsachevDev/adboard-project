import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Search from '@/components/ui/Search/Search';
import "./globals.scss";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "AdBoard - Доска объявлений",
    description: "Современная доска объявлений для всех ваших потребностей.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                <Header />
                <Search />
                <main style={{ flexGrow: 1 }}>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
