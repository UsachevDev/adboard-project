'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            setIsLoggedIn(true);
            // В реальном приложении здесь можно декодировать JWT
            // или отправить запрос на бэкенд, чтобы получить имя пользователя.
            // Пока что используем заглушку или имя из токена, если оно там есть.
            // Для примера, извлекаем "username" из заглушечного токена, если он там есть
            const match = token.match(/fake-jwt-token-for-(\w+)-/);
            if (match && match[1]) {
                setUsername(match[1]);
            } else {
                setUsername('Пользователь'); // Имя по умолчанию, если не удалось извлечь
            }
        } else {
            setIsLoggedIn(false);
            setUsername(null);
        }

        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem('jwt_token');
            if (updatedToken) {
                setIsLoggedIn(true);
                const match = updatedToken.match(/fake-jwt-token-for-(\w+)-/);
                setUsername(match && match[1] ? match[1] : 'Пользователь');
            } else {
                setIsLoggedIn(false);
                setUsername(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        // localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        setUsername(null);
        router.push('/');
    };

    return (
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
                                <Link href="/auth" className={styles.navLink}>
                                    Войти
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
