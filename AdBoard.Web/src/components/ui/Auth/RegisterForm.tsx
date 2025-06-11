// src/components/ui/Auth/RegisterForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // <--- ДОБАВЛЕНО: Импортируем Link
import styles from './RegisterForm.module.scss';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/types';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Пароли не совпадают.' });
            setLoading(false);
            return;
        }

        // Имитация задержки сети
        // ИСПРАВЛЕНО: setTimeout теперь вызывается с функцией-колбэком
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Имитация регистрации
        const existingUser = mockUsers.find(user => user.email === email);

        if (existingUser) {
            setMessage({ type: 'error', text: 'Пользователь с таким email уже существует.' });
        } else {
            const newUser: User = {
                id: `user-${mockUsers.length + 1}-uuid`,
                email: email,
                createdAt: new Date().toISOString(),
            };
            mockUsers.push(newUser);

            setMessage({ type: 'success', text: 'Регистрация успешна! Теперь вы можете войти.' });
            onRegisterSuccess();
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Регистрация</h2>
            <form onSubmit={handleSubmit}>
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
                </div>
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
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
            {message && (
                <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                    {message.text}
                </p>
            )}
            <div className={styles.formFooter}>
                Уже есть аккаунт?{' '}
                {/* ИСПРАВЛЕНО: Link теперь компонент */}
                <Link href="#" onClick={onSwitchToLogin}>
                    Войти
                </Link>
            </div>
        </div>
    );
};

export default RegisterForm;
