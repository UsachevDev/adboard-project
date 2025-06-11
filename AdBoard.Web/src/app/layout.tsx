// src/app/layout.tsx (Остается таким, каким он был до этого)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LayoutContent from '@/components/layout/LayoutContent'; // Импортируем новый компонент
import "./globals.scss"; // <-- ЭТА СТРОКА ДОЛЖНА ОСТАТЬСЯ ЗДЕСЬ И ТОЛЬКО ЗДЕСЬ!

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
                <LayoutContent>{children}</LayoutContent>
            </body>
        </html>
    );
}
