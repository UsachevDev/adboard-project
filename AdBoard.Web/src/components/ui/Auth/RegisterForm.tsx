'use client';

import React, { useState } from 'react';
import styles from './RegisterForm.module.scss';

interface RegisterFormProps {
    onRegisterSuccess?: () => void;
    onSwitchToLogin: () => void;
}

export default function RegisterForm({ onRegisterSuccess, onSwitchToLogin }: RegisterFormProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        setIsError(false);

        if (password !== confirmPassword) {
            setMessage('Пароли не совпадают!');
            setIsError(true);
            return;
        }

        // --- Подготовка к отправке данных на бэкенд ---
        // Имитация
        try {
            console.log('Попытка регистрации с данными (имитация):', { username, email, password });

            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Имитация успешного ответа от бэкенда
            if (username.length >= 3 && password.length >= 6) { // Простая валидация
                setMessage('Регистрация прошла успешно! Теперь вы можете войти.');
                setIsError(false);
                if (onRegisterSuccess) {
                    onRegisterSuccess();
                }
                // Очистка формы
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setMessage('Имя пользователя должно быть не менее 3 символов, а пароль - не менее 6.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Ошибка при регистрации (имитация):', error);
            setMessage('Произошла ошибка при попытке регистрации. Попробуйте еще раз.');
            setIsError(true);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.label}>Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email (опционально):</label>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>Подтвердите пароль:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>
                <button type="submit" className={styles.button}>Зарегистрироваться</button>
                {message && (
                    <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
                        {message}
                    </div>
                )}
            </form>
            <div className={styles.formFooter}>
                Уже есть аккаунт?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Войти</a>
            </div>
        </div>
    );
}
