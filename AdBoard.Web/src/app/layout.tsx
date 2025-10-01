import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

import { Suspense } from "react";               // ← добавь
import LayoutContent from "@/components/layout/LayoutContent";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AdBoard - Доска объявлений",
    description: "Современная доска объявлений для всех ваших потребностей.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                <Suspense fallback={null}>
                    <UserProvider>
                        <LayoutContent>
                            {/* на всякий случай можно и children завернуть */}
                            <Suspense fallback={null}>{children}</Suspense>
                        </LayoutContent>
                    </UserProvider>
                </Suspense>
            </body>
        </html>
    );
}
