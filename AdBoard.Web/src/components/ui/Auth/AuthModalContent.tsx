'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './AuthModalContent.module.scss';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { UserProfile } from '@/types/index';

interface AuthModalContentProps {
    onClose: () => void;
}

const AuthModalContent: React.FC<AuthModalContentProps> = ({ onClose }) => {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();

    const handleLoginSuccess = async (tokens: { accessToken: string; refreshToken: string }) => {
        localStorage.setItem('access_token', tokens.accessToken);
        sessionStorage.setItem('refresh_token', tokens.refreshToken);
        console.log('Токены сохранены. Access (LS):', tokens.accessToken, 'Refresh (SS):', tokens.refreshToken);

        try {
            const userResponse = await api('/users');
            if (userResponse.ok) {
                const userResult = await userResponse.json();
                if (!userResult.error && userResult.data) {
                    const userProfile: UserProfile = userResult.data;
                    if (userProfile.name) {
                        localStorage.setItem('user_name', userProfile.name);
                        console.log('Имя пользователя сохранено:', userProfile.name);
                    } else if (userProfile.email) {
                        localStorage.setItem('user_name', userProfile.email.split('@')[0]);
                        console.log('Имя пользователя сохранено (из email):', userProfile.email.split('@')[0]);
                    } else {
                        localStorage.setItem('user_name', 'Пользователь');
                        console.log('Имя пользователя по умолчанию: Пользователь');
                    }
                }
            } else {
                console.warn('Не удалось получить профиль пользователя после входа:', await userResponse.text());
                localStorage.setItem('user_name', 'Пользователь'); 
            }
        } catch (error) {
            console.error('Ошибка при получении профиля пользователя после входа:', error);
            localStorage.setItem('user_name', 'Пользователь');
        }

        onClose();
        router.push('/profile');
    };

    const handleRegisterSuccess = () => {
        setAuthMessage({ type: 'success', text: 'Регистрация успешна! Теперь войдите с вашими данными.' });
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
                <p className={`${styles.message} ${authMessage.type === 'success' ? styles.success : styles.error}`}>
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
