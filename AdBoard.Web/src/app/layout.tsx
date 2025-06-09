import "./globals.scss";
import type { Metadata } from "next";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

export const metadata: Metadata = {
    title: "AdBoard - Доска объявлений",
    description: "Современная доска объявлений для всех ваших потребностей.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body>
                <Header />
                <div style={{ flexGrow: 1 }}>
                    {/* Обертка для основного контента, чтобы Header/Footer были фиксированными */}
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
