'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './LoginForm.module.scss';

interface LoginFormProps {
    onLoginSuccess: (tokens: { accessToken: string; refreshToken: string }) => void;
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

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                const accessToken = result.data.access_token;
                const refreshToken = result.data.refresh_token;

                setMessage({ type: 'success', text: 'Успешный вход!' });
                onLoginSuccess({ accessToken, refreshToken }); 
                
                setEmail('');
                setPassword('');

            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Неверный email или пароль.';
                setMessage({ type: 'error', text: errorMessage });
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            setMessage({ type: 'error', text: 'Не удалось подключиться к серверу. Попробуйте позже.' });
        } finally {
            setLoading(false);
        }
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
                <Link href="#" onClick={onSwitchToRegister}>
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
