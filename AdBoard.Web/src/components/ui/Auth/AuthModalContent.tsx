'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './AuthModalContent.module.scss';
import { useRouter } from 'next/navigation';

interface AuthModalContentProps {
    onClose: () => void;
}

const AuthModalContent: React.FC<AuthModalContentProps> = ({ onClose }) => {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const router = useRouter();

    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('jwt_token', token);
        console.log('JWT Token сохранен:', token);
        onClose();
        router.push('/profile');
    };

    const handleRegisterSuccess = () => {
        setShowRegisterForm(false);
        alert('Регистрация успешна! Теперь войдите с вашими данными.');
    };

    return (
        <div className={styles.authModalContent}>
            {showRegisterForm ? (
                <RegisterForm
                    onRegisterSuccess={handleRegisterSuccess}
                    onSwitchToLogin={() => setShowRegisterForm(false)}
                />
            ) : (
                <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={() => setShowRegisterForm(true)}
                />
            )}
        </div>
    );
};

export default AuthModalContent;
