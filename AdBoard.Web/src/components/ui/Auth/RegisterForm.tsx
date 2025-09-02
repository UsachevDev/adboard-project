"use client";

import React, { useState } from "react";
import Link from "next/link";
import { register } from "@/lib/api";
import styles from "./RegisterForm.module.scss";

const parseApiError = (err: unknown): string => {
    if (err instanceof Error) {
        try {
            const messages = err.message
                .split("\n")
                .map((line) => JSON.parse(line).error)
                .filter(Boolean);
            return messages.join(" ") || err.message;
        } catch {
            return err.message;
        }
    }
    return "Ошибка сети при попытке регистрации.";
};

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

// Форматирует строку цифр в вид +7 (XXX) XXX-XX-XX
const formatPhone = (digits: string): string => {
    let raw = digits.slice(0, 11);
    if (raw[0] !== "7") raw = "7" + raw;

    const parts = raw.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (!parts) return "+7";

    let formatted = "+7";
    if (parts[1]) formatted += ` (${parts[1]}`;
    if (parts[1] && parts[1].length === 3) formatted += `)`;
    if (parts[2]) formatted += ` ${parts[2]}`;
    if (parts[3]) formatted += `-${parts[3]}`;
    if (parts[4]) formatted += `-${parts[4]}`;

    return formatted;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
    onRegisterSuccess,
    onSwitchToLogin,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string; } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (password.length < 8) {
            setMessage({ type: "error", text: "Пароль должен быть не короче 8 символов." });
            setLoading(false);
            return;
        }

        // Проверяем наличие телефона
        if (!phoneNumber.trim()) {
            setMessage({ type: "error", text: "Номер телефона обязателен." });
            setLoading(false);
            return;
        }

        // Убираем не-цифры для проверки длины
        const digits = phoneNumber.replace(/\D/g, "");
        if (digits.length !== 11) {
            setMessage({ type: "error", text: "Введите корректный номер телефона." });
            setLoading(false);
            return;
        }

        // Проверяем пароли
        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Пароли не совпадают." });
            setLoading(false);
            return;
        }

        // Проверка: город не должен содержать цифр (если введён)
        if (city && !/^[^\d]+$/.test(city)) {
            setMessage({ type: "error", text: "Поле «Город» не должно содержать цифр." });
            setLoading(false);
            return;
        }

        try {
            await register(
                email,
                password,
                name,
                phoneNumber,
                city || undefined
            );
            setMessage({ type: "success", text: "Регистрация успешна! Теперь вы можете войти." });
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setName("");
            setPhoneNumber("");
            setCity("");
            onRegisterSuccess();
        } catch (err: unknown) {
            console.error("Ошибка при регистрации:", err);
            setMessage({ type: "error", text: parseApiError(err) });
        } finally {
            setLoading(false);
        }
    };

    // Обработчик ввода в поле телефона
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setPhoneNumber(formatPhone(digits));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className={styles.formGroup}>
                    <label htmlFor="regEmail" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="regEmail"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Пароль */}
                <div className={styles.formGroup}>
                    <label htmlFor="regPassword" className={styles.label}>Пароль</label>
                    <input
                        type="password"
                        id="regPassword"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <small className={styles.hint}>Пароль должен быть не короче 8 символов</small>
                </div>

                {/* Подтверждение пароля */}
                <div className={styles.formGroup}>
                    <label htmlFor="regConfirmPassword" className={styles.label}>Подтвердите пароль</label>
                    <input
                        type="password"
                        id="regConfirmPassword"
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Имя */}
                <div className={styles.formGroup}>
                    <label htmlFor="regName" className={styles.label}>Ваше имя</label>
                    <input
                        type="text"
                        id="regName"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* Телефон */}
                <div className={styles.formGroup}>
                    <label htmlFor="regPhoneNumber" className={styles.label}>Номер телефона (обязательно)</label>
                    <input
                        type="tel"
                        id="regPhoneNumber"
                        className={styles.input}
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        required
                        placeholder="+7 (___) ___-__-__"
                        pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
                        title="Формат: +7 (XXX) XXX-XX-XX"
                    />
                </div>

                {/* Город */}
                <div className={styles.formGroup}>
                    <label htmlFor="regCity" className={styles.label}>Город (необязательно)</label>
                    <input
                        type="text"
                        id="regCity"
                        className={styles.input}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        maxLength={50}
                        pattern="[^\\d]*"
                        title="Город не должен содержать цифр"
                    />
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                </button>
            </form>

            {message && (
                <p className={`${styles.message} ${message.type === "success" ? styles.success : styles.error}`}>
                    {message.text}
                </p>
            )}

            <div className={styles.formFooter}>
                Уже есть аккаунт?{' '}
                <Link href="#" onClick={onSwitchToLogin}>
                    Войти
                </Link>
            </div>
        </div>
    );
};

export default RegisterForm;
