"use client"; // Может быть клиентским, если есть интерактивность

import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>
                    &copy; {new Date().getFullYear()} AdBoard. Все права
                    защищены.
                </p>
                <ul className={styles.links}>
                    <li>
                        <a href="/about" className={styles.link}>
                            О нас
                        </a>
                    </li>
                    <li>
                        <a href="/contact" className={styles.link}>
                            Контакты
                        </a>
                    </li>
                    <li>
                        <a href="/privacy" className={styles.link}>
                            Политика конфиденциальности
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
