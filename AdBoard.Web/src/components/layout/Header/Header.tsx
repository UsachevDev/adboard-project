"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Modal from "@/components/ui/Modal/Modal";
import AuthModalContent from "@/components/ui/Auth/AuthModalContent";
import Avatar from "@/components/ui/Avatar/Avatar";
import { logout } from "@/lib/api";

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const checkAuthStatus = () => {
        const token = localStorage.getItem("access_token");
        const storedName = localStorage.getItem("user_name");

        if (token) {
            setIsLoggedIn(true);
            if (storedName) {
                setUsername(storedName);
            } else {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const email = payload.email || payload.sub;
                    setUsername(email ? email.split("@")[0] : "Пользователь");
                } catch {
                    setUsername("Пользователь");
                }
            }
        } else {
            setIsLoggedIn(false);
            setUsername(null);
        }
    };

    useEffect(() => {
        checkAuthStatus();
        window.addEventListener("storage", checkAuthStatus);
        return () => {
            window.removeEventListener("storage", checkAuthStatus);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Ошибка при выходе:", err);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_name");
            setIsLoggedIn(false);
            setUsername(null);
            router.push("/");
        }
    };

    const openAuthModal = () => setIsModalOpen(true);
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
                                        <Link
                                            href="/profile"
                                            className={styles.navLink}
                                        >
                                            <div
                                                className={styles.navLinkAvatar}
                                            >
                                                <Avatar
                                                    name={
                                                        username ||
                                                        "Пользователь"
                                                    }
                                                    size="2rem"
                                                />
                                            </div>
                                            {username || "Профиль"}
                                        </Link>
                                    </li>
                                    <li className={styles.navItem}>
                                        <button
                                            onClick={handleLogout}
                                            className={styles.navLinkButton}
                                        >
                                            Выйти
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className={styles.navItem}>
                                    <button
                                        onClick={openAuthModal}
                                        className={styles.navLinkButton}
                                    >
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
