'use client';

import { useState } from 'react';
import LoginForm from '@/components/ui/Auth/LoginForm';
import RegisterForm from '@/components/ui/Auth/RegisterForm';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const router = useRouter();

    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('jwt_token', token);
        console.log('JWT Token сохранен:', token);
        router.push('/');
    };

    const handleRegisterSuccess = () => {
        setShowRegisterForm(false);
        alert('Регистрация успешна! Теперь войдите с вашими данными.');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
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
}
