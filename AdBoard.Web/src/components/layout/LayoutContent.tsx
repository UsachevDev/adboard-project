// src/components/layout/LayoutContent.tsx
'use client'; // <-- Обязательно, так как используется usePathname

import React from 'react';
import { usePathname } from 'next/navigation'; // Импортируем хук
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Search from '@/components/ui/Search/Search'; // Ваш компонент поиска
// import "@/styles/globals.scss"; // <-- УДАЛИТЬ ЭТУ СТРОКУ! Она должна быть только в src/app/layout.tsx

interface LayoutContentProps {
    children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
    const pathname = usePathname(); // Получаем текущий путь

    // Определяем, нужно ли отображать панель поиска
    const shouldShowSearch = pathname !== '/profile';

    return (
        <>
            <Header />
            {shouldShowSearch && <Search />} {/* Условный рендеринг Search */}
            <main style={{ flexGrow: 1 }}>{children}</main>
            <Footer />
        </>
    );
};

export default LayoutContent;
