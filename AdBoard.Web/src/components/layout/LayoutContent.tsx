'use client';

import React from 'react';
import { usePathname } from 'next/navigation'; 
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Search from '@/components/ui/Search/Search';


interface LayoutContentProps {
    children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
    const pathname = usePathname();

    const shouldShowSearch = pathname !== '/profile';

    return (
        <>
            <Header />
            {shouldShowSearch && <Search />}
            <main style={{ flexGrow: 1 }}>{children}</main>
            <Footer />
        </>
    );
};

export default LayoutContent;
