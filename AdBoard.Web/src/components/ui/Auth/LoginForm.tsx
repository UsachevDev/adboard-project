'use client';

import React, { useState } from 'react';
import styles from './LoginForm.module.scss';

interface LoginFormProps {
    onLoginSuccess?: (token: string) => void;
    onSwitchToRegister: () => void;
}

export default function LoginForm({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        setIsError(false);

        // --- Подготовка к отправке данных на бэкенд и обработке JWT ---
        // Имитация
        try {
            console.log('Попытка входа с данными (имитация):', { username, password });

            // Имитация задержки сети, как если бы запрос шел на сервер
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Имитация ответа от бэкенда (успешный или неуспешный логин)
            if (username === 'test' && password === 'password') {
                const fakeToken = `fake-jwt-token-for-${username}-${Date.now()}`;
                setMessage('Вход выполнен успешно! Токен получен (имитация).');
                setIsError(false);

                // *** Здесь будет реальная логика сохранения JWT и перенаправления ***
                // 1. Сохранение токена:
                localStorage.setItem('jwt_token', fakeToken);

                // 2. Вызов колбэка для родительского компонента
                if (onLoginSuccess) {
                    onLoginSuccess(fakeToken);
                }

                console.log('Имитация успешного входа, токен сохранен:', fakeToken);
                // В реальном приложении: перенаправление на главную страницу или дашборд
                // router.push('/dashboard');
            } else {
                setMessage('Неверное имя пользователя или пароль (имитация).');
                setIsError(true);
            }
        } catch (error) {
            console.error('Ошибка при входе (имитация):', error);
            setMessage('Произошла ошибка при попытке входа. Попробуйте еще раз.');
            setIsError(true);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Вход</h2>
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
                    <label htmlFor="password" className={styles.label}>Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" className={styles.button}>Войти</button>
                {message && (
                    <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
                        {message}
                    </div>
                )}
            </form>
            <div className={styles.formFooter}>
                Ещё нет аккаунта?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>Зарегистрироваться</a>
            </div>
        </div>
    );
}
