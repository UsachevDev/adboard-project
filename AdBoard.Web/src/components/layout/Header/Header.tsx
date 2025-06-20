'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Modal from '@/components/ui/Modal/Modal';
import AuthModalContent from '@/components/ui/Auth/AuthModalContent';
import Avatar from '@/components/ui/Avatar/Avatar';
import api from '@/lib/api';

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const checkAuthStatus = () => {
        const accessToken = localStorage.getItem('access_token');
        const storedUserName = localStorage.getItem('user_name');

        if (accessToken) {
            setIsLoggedIn(true);
            if (storedUserName) {
                setUsername(storedUserName);
            } else {
                try {
                    const parts = accessToken.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        const userEmail = payload.email || payload.sub; 
                        if (userEmail) {
                            setUsername(userEmail.split('@')[0]);
                        } else {
                            setUsername('Пользователь');
                        }
                    } else {
                        setUsername('Пользователь');
                    }
                } catch (e) {
                    console.error("Failed to parse access token for username:", e);
                    setUsername('Пользователь');
                }
            }
        } else {
            setIsLoggedIn(false);
            setUsername(null);
        }
    };

    useEffect(() => {
        checkAuthStatus();

        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = sessionStorage.getItem('refresh_token');
            const response = await api('/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken || '' }), 
            });

            if (!response.ok) {
                console.error('Ошибка при выходе на сервере:', response.status, await response.text());
            }
        } catch (error) {
            console.error('Ошибка сети или другая ошибка при выходе:', error);
        } finally {
            localStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            localStorage.removeItem('user_name');
            setIsLoggedIn(false);
            setUsername(null);
            router.push('/');
        }
    };

    const openAuthModal = () => {
        setIsModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsModalOpen(false);
        checkAuthStatus(); 
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        AdBoard
                    </Link>
                    <nav className={styles.nav}>
                        <ul className={styles.navList}>
                            <li className={styles.navItem}>
                                <Link
                                    href="/add-announcement"
                                    className={styles.navLink}
                                >
                                    Подать объявление
                                </Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li className={styles.navItem}>
                                        <Link href="/profile" className={styles.navLink}>
                                            <div className={styles.navLinkAvatar}>
                                                <Avatar name={username || 'Пользователь'} size="2rem" />
                                            </div>
                                            {username || 'Профиль'}
                                        </Link>
                                    </li>
                                    <li className={styles.navItem}>
                                        <button onClick={handleLogout} className={styles.navLinkButton}>
                                            Выйти
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className={styles.navItem}>
                                    <button onClick={openAuthModal} className={styles.navLinkButton}>
                                        Войти
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>

            <Modal isOpen={isModalOpen} onClose={closeAuthModal}>
                <AuthModalContent onClose={closeAuthModal} />
            </Modal>
        </>
    );
};

export default Header;
