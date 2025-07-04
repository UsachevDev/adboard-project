"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Modal from "@/components/ui/Modal/Modal";
import AuthModalContent from "@/components/ui/Auth/AuthModalContent";
import Avatar from "@/components/ui/Avatar/Avatar";
import { logout } from "@/lib/api";
import { useUserContext } from "@/context/UserContext";
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";

export default function Header() {
    const { user } = useUserContext();
    const [showAuth, setShowAuth] = useState(false);
    const [showFav, setShowFav] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const favRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (favRef.current && !favRef.current.contains(e.target as Node)) {
                setShowFav(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            window.location.href = "/";
        }
    };

    const favPreview = user?.favorites?.slice(0, 5) ?? [];

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoMain}>AdBoard</span>
                        <span className={styles.logoSub}>Доска объявлений</span>
                    </Link>

                    <div className={styles.headerRight}>
                        {user && (
                            <Link
                                href="/add-announcement"
                                className={styles.addButton}
                                aria-label="Подать объявление"
                                onClick={() => setMenuOpen(false)}
                            >
                                <span className={styles.addBtnText}>
                                    Подать объявление
                                </span>
                                <span className={styles.addBtnIcon}>
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="11"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                        <path
                                            d="M8 12h8M12 8v8"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                            </Link>
                        )}

                        {user && (
                            <div ref={favRef} className={styles.favWrapper}>
                                <button
                                    className={styles.favButton}
                                    onClick={() => setShowFav((v) => !v)}
                                    aria-label="Показать избранное"
                                    aria-expanded={showFav}
                                >
                                    <svg
                                        className={styles.heartIcon}
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                    </svg>
                                </button>
                                {showFav && (
                                    <div className={styles.favDropdown}>
                                        {favPreview.length > 0 ? (
                                            favPreview.map((ann) => (
                                                <AnnouncementCard
                                                    key={ann.id}
                                                    announcement={ann}
                                                />
                                            ))
                                        ) : (
                                            <p className={styles.emptyMessage}>
                                                Нет избранных
                                            </p>
                                        )}
                                        <button
                                            className={styles.showAllButton}
                                            onClick={() => {
                                                setShowFav(false);
                                                router.push("/favorites");
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Показать все
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""
                                }`}
                            aria-label={
                                menuOpen ? "Закрыть меню" : "Открыть меню"
                            }
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>

                    <nav
                        className={`${styles.nav} ${menuOpen ? styles.navOpen : ""
                            }`}
                    >
                        <ul className={styles.navList}>
                            {user && (
                                <>
                                    <li>
                                        <Link
                                            href="/profile"
                                            className={styles.profileLink}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <Avatar
                                                name={user.name ?? ""}
                                                size="2rem"
                                            />
                                            <span className={styles.userName}>
                                                {user.name}
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMenuOpen(false);
                                            }}
                                            className={styles.navLinkButton}
                                        >
                                            Выйти
                                        </button>
                                    </li>
                                </>
                            )}
                            {!user && (
                                <li>
                                    <button
                                        onClick={() => {
                                            setShowAuth(true);
                                            setMenuOpen(false);
                                        }}
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

            <Modal isOpen={showAuth} onClose={() => setShowAuth(false)}>
                <AuthModalContent onClose={() => setShowAuth(false)} />
            </Modal>
        </>
    );
}
