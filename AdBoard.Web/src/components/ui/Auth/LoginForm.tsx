// src/components/ui/Auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // <--- ДОБАВЛЕНО: Импортируем Link
import styles from './LoginForm.module.scss';
import { mockUsers } from '@/lib/mockData';

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Имитация задержки сети
        // ИСПРАВЛЕНО: setTimeout теперь вызывается с функцией-колбэком
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Имитация аутентификации на основе mockUsers
        const userFound = mockUsers.find(user => user.email === email);

        if (userFound) {
            const fakeToken = `fake-jwt-token-for-${email}-uuid-${Date.now()}`;
            onLoginSuccess(fakeToken);
            setMessage({ type: 'success', text: 'Успешный вход! Перенаправление...' });
        } else {
            setMessage({ type: 'error', text: 'Неверный email или пароль.' });
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Вход</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
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
                    <label htmlFor="password" className={styles.label}>Пароль</label>
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
            {message && (
                <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                    {message.text}
                </p>
            )}
            <div className={styles.formFooter}>
                Нет аккаунта?{' '}
                {/* ИСПРАВЛЕНО: Link теперь компонент */}
                <Link href="#" onClick={onSwitchToRegister}>
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
