"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./AuthModalContent.module.scss";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import { UserProfile } from "@/types/index";

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

    const handleLoginSuccess = async (accessToken: string) => {
        localStorage.setItem("access_token", accessToken);
        console.log("Токен Access сохранен.");

        try {
            const userProfile: UserProfile = await getCurrentUser();
            const nameToStore =
                userProfile.name ??
                userProfile.email?.split("@")[0] ??
                "Пользователь";
            localStorage.setItem("user_name", nameToStore);
            console.log("Имя пользователя сохранено:", nameToStore);
        } catch (error) {
            console.error(
                "Ошибка при получении профиля пользователя после входа:",
                error
            );
            localStorage.setItem("user_name", "Пользователь");
        }

        onClose();
        router.push("/profile");
    };

    const handleRegisterSuccess = () => {
        setAuthMessage({
            type: "success",
            text: "Регистрация успешна! Теперь войдите с вашими данными.",
        });
        setShowRegisterForm(false);
    };

    const handleSwitchToLogin = () => {
        setShowRegisterForm(false);
        setAuthMessage(null);
    };

    const handleSwitchToRegister = () => {
        setShowRegisterForm(true);
        setAuthMessage(null);
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
                    onSwitchToLogin={handleSwitchToLogin}
                />
            ) : (
                <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            )}
        </div>
    );
};

export default AuthModalContent;
