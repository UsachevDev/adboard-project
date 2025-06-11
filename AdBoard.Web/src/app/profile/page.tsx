'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './ProfilePage.module.scss';
import { mockUsers, mockAnnouncements } from '@/lib/mockData';
import { User, Announcement } from '@/types';

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [userAnnouncements, setUserAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('jwt_token');

            if (!token) {
                setError('Для просмотра профиля необходимо войти в систему.');
                setLoading(false);
                return;
            }

            // Имитация получения User ID из токена
            const match = token.match(/fake-jwt-token-for-(\w+)@example.com-/);
            let userEmailFromToken: string | null = null;
            if (match && match[1]) {
                userEmailFromToken = `${match[1]}@example.com`;
            }

            if (!userEmailFromToken) {
                setError('Не удалось определить пользователя из токена.');
                setLoading(false);
                localStorage.removeItem('jwt_token');
                return;
            }

            const foundUser = mockUsers.find(user => user.email === userEmailFromToken);

            if (foundUser) {
                setUserData(foundUser);
                const announcements = mockAnnouncements.filter(ann => ann.creatorId === foundUser.id);
                setUserAnnouncements(announcements);
            } else {
                setError('Пользователь не найден в системе (mock-данных).');
                localStorage.removeItem('jwt_token');
            }
            setLoading(false);
        };

        loadUserProfile();
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <p>Загрузка данных профиля...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Ошибка загрузки профиля</h1>
                <p className={`${styles.welcomeMessage} ${styles.error}`}>{error}</p>
                <p className={styles.loginPrompt}>
                    Пожалуйста, используйте кнопку "Войти" в шапке сайта для авторизации.
                </p>
            </div>
        );
    }

    if (!userData) {
         return (
            <div className={styles.container}>
                <h1 className={styles.title}>Вам необходимо авторизоваться</h1>
                <p className={styles.loginPrompt}>
                    Для просмотра профиля, пожалуйста, <Link href="#" onClick={() => {
                        alert('Пожалуйста, используйте кнопку "Войти" в шапке сайта для авторизации.');
                    }}>войдите</Link> или <Link href="#" onClick={() => {
                        alert('Пожалуйста, используйте кнопку "Войти" в шапке сайта, затем "Зарегистрироваться" для создания аккаунта.');
                    }}>зарегистрируйтесь</Link>.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Привет, {userData.email.split('@')[0]}!</h1>
            <p className={styles.welcomeMessage}>Добро пожаловать в ваш личный кабинет AdBoard.</p>

            <h2 className={styles.sectionTitle}>Мои объявления ({userAnnouncements.length})</h2>
            <div className={styles.announcementsGrid}>
                {userAnnouncements.length > 0 ? (
                    userAnnouncements.map(announcement => (
                        <div key={announcement.id} className={styles.announcementItem}>
                            <h3>{announcement.title}</h3>
                            <p>{announcement.description.substring(0, 100)}...</p>
                            <p>Цена: {announcement.price} руб.</p>
                            <p>Город: {announcement.city}</p>
                            <Link href={`/announcements/${announcement.id}`} className={styles.viewAnnouncementLink}>
                                Подробнее
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className={styles.placeholder}>
                        <p>У вас пока нет активных объявлений.</p>
                        <Link href="/add-announcement" className={styles.addAnnouncementLink}>
                            Подать первое объявление
                        </Link>
                    </div>
                )}
            </div>

            <h2 className={styles.sectionTitle}>Настройки аккаунта</h2>
            <div className={styles.infoBlock}>
                <p><span>Email:</span> {userData.email}</p>
                <p><span>Дата регистрации:</span> {new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={styles.placeholder}>
                Здесь будут настройки вашего профиля (изменение пароля, email и т.д.).
            </div>
        </div>
    );
};

export default ProfilePage;
