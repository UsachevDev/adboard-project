"use client";

import React from "react";
import Link from "next/link";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
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
                                href="/announcements"
                                className={styles.navLink}
                            >
                                Объявления
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link
                                href="/add-announcement"
                                className={styles.navLink}
                            >
                                Подать объявление
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/profile" className={styles.navLink}>
                                Профиль
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/login" className={styles.navLink}>
                                Войти
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
