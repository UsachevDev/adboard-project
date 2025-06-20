'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './RegisterForm.module.scss';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');

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

        try {
            const response = await fetch('http://localhost:8080/api/auth/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    phoneNumber: phoneNumber || null,
                    city: city || null,
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Регистрация успешна! Теперь вы можете войти.' });
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');
                setPhoneNumber('');
                setCity('');
                onRegisterSuccess();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Произошла ошибка при регистрации.';
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
                <div className={styles.formGroup}>
                    <label htmlFor="regPhoneNumber" className={styles.label}>Номер телефона (необязательно)</label>
                    <input
                        type="tel"
                        id="regPhoneNumber"
                        className={styles.input}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="regCity" className={styles.label}>Город (необязательно)</label>
                    <input
                        type="text"
                        id="regCity"
                        className={styles.input}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
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
                <Link href="#" onClick={onSwitchToLogin}>
                    Войти
                </Link>
            </div>
        </div>
    );
};

export default RegisterForm;
