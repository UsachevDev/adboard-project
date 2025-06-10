"use client"; // Может быть клиентским, если есть интерактивность

import React from "react";
import SocialLink from '@/components/ui/SocialLink/SocialLink';
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>
                    &copy; {new Date().getFullYear()} AdBoard. Все права
                    защищены.
                </p>
                <div className={styles.links}>
                    <nav className={styles.socialNav}>
                        <SocialLink href="https://vk.com/" iconSrc="/icons/vk.svg" alt="vk" label="vk Profile" />
                        <SocialLink href="https://ok.ru/" iconSrc="/icons/ok.svg" alt="ok" label="ok Profile" />
                        <SocialLink href="https://www.youtube.com/" iconSrc="/icons/youtube.svg" alt="youtube" label="youtube Profile" />
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
