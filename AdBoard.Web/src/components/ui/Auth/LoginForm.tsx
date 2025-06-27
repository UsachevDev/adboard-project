"use client";

import React, { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/api";
import styles from "./LoginForm.module.scss";

interface LoginFormProps {
    onLoginSuccess: (accessToken: string) => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onLoginSuccess,
    onSwitchToRegister,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await login(email, password);
            const token = localStorage.getItem("access_token");
            if (token) {
                setMessage({ type: "success", text: "Успешный вход!" });
                onLoginSuccess(token);
                setEmail("");
                setPassword("");
            } else {
                throw new Error("Не удалось получить токен после входа.");
            }
        } catch (err: unknown) {
            console.error("Ошибка при логине:", err);
            const text =
                err instanceof Error
                    ? err.message
                    : "Ошибка сети при попытке входа.";
            setMessage({ type: "error", text });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Вход</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Вход..." : "Войти"}
                </button>
            </form>

            {message && (
                <p
                    className={`${styles.message} ${
                        message.type === "success"
                            ? styles.success
                            : styles.error
                    }`}
                >
                    {message.text}
                </p>
            )}
            <div className={styles.formFooter}>
                Нет аккаунта?{" "}
                <Link href="#" onClick={onSwitchToRegister}>
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
