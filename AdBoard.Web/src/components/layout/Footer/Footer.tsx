"use client";

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
            </div>
        </footer>
    );
};

export default Footer;
