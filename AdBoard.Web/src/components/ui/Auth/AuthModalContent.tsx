"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./AuthModalContent.module.scss";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

interface AuthModalContentProps {
    onClose: () => void;
}

const AuthModalContent: React.FC<AuthModalContentProps> = ({ onClose }) => {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [authMessage, setAuthMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const router = useRouter();
    const { refreshUser } = useUserContext();

    const handleLoginSuccess = async (accessToken: string) => {
        localStorage.setItem("access_token", accessToken);
        await refreshUser();
        onClose();
        router.push("/profile");
    };

    const handleRegisterSuccess = () => {
        setAuthMessage({
            type: "success",
            text: "Регистрация успешна! Теперь войдите.",
        });
        setShowRegisterForm(false);
    };

    return (
        <div className={styles.authModalContent}>
            {authMessage && (
                <p
                    className={`${styles.message} ${
                        authMessage.type === "success"
                            ? styles.success
                            : styles.error
                    }`}
                >
                    {authMessage.text}
                </p>
            )}

            {showRegisterForm ? (
                <RegisterForm
                    onRegisterSuccess={handleRegisterSuccess}
                    onSwitchToLogin={() => {
                        setShowRegisterForm(false);
                        setAuthMessage(null);
                    }}
                />
            ) : (
                <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={() => {
                        setShowRegisterForm(true);
                        setAuthMessage(null);
                    }}
                />
            )}
        </div>
    );
};

export default AuthModalContent;
