'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './ProfilePage.module.scss';
import api from '@/lib/api';
import EditProfileForm from '@/components/ui/Profile/EditProfileForm';
import { UserProfile, Announcement } from '@/types/index';
import Avatar from '@/components/ui/Avatar/Avatar';

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [userAnnouncements, setUserAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const router = useRouter();

    const loadUserProfile = async () => {
        setLoading(true);
        setError(null);

        const accessToken = localStorage.getItem('access_token');
        const refreshToken = sessionStorage.getItem('refresh_token');

        if (!accessToken && !refreshToken) {
            setError('Для просмотра профиля необходимо войти в систему.');
            setLoading(false);
            return;
        }

        try {
            const userResponse = await api('/users');

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                throw new Error('Failed to fetch user profile: ' + errorText);
            }
            const userResult = await userResponse.json();
            if (userResult.error) {
                throw new Error('Error from API: ' + userResult.error);
            }
            setUserData(userResult.data as UserProfile);

            try {
                const announcementsResponse = await api('/announcements/my');
                if (!announcementsResponse.ok) {
                    console.warn('Could not fetch user announcements:', await announcementsResponse.text());
                    setUserAnnouncements([]);
                } else {
                    const announcementsResult = await announcementsResponse.json();
                    if (announcementsResult.error) {
                        console.warn('API Error fetching announcements:', announcementsResult.error);
                        setUserAnnouncements([]);
                    } else {
                        setUserAnnouncements(announcementsResult.data as Announcement[]);
                    }
                }
            } catch (announcementsErr) {
                console.warn('Error fetching user announcements (network/other issue):', announcementsErr);
                setUserAnnouncements([]);
            }

        } catch (err: any) {
            console.error('Ошибка загрузки профиля:', err);
            setError(err.message || 'Произошла ошибка при загрузке профиля.');

            if (err.message.includes('Unauthorized') || err.message.includes('Could not refresh token')) {
                router.push('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserProfile();
    }, [router]);

    const handleProfileSave = (updatedData: UserProfile) => {
        setUserData(updatedData);
        setIsEditing(false);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

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
                    Пожалуйста, убедитесь, что вы вошли в систему.
                </p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Вам необходимо авторизоваться</h1>
                <p className={styles.loginPrompt}>
                    Для просмотра профиля, пожалуйста, используйте кнопку "Войти" в шапке сайта для авторизации.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {isEditing && userData ? (
                <EditProfileForm
                    initialData={userData}
                    onSave={handleProfileSave}
                    onCancel={handleEditCancel}
                />
            ) : (
                <>
                    <div className={styles.profileHeader}>
                        <div className={styles.profileHeaderAvatar}>
                            <Avatar name={userData.name || userData.email?.split('@')[0] || 'Пользователь'} size="5rem" />
                        </div>
                        <h1 className={styles.profileHeaderTitle}>Привет, {userData.name || userData.email?.split('@')[0] || 'Пользователь'}!</h1>
                    </div>
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
                        {userData.phoneNumber && <p><span>Телефон:</span> {userData.phoneNumber}</p>}
                        {userData.city && <p><span>Город:</span> {userData.city}</p>}
                        {userData.createdAt && <p><span>Дата регистрации:</span> {new Date(userData.createdAt).toLocaleDateString()}</p>}
                    </div>

                    <div className={styles.editButtonContainer}>
                        <button className={styles.editProfileButton} onClick={() => setIsEditing(true)}>
                            Редактировать профиль
                        </button>
                    </div>

                    <div className={styles.placeholder}>
                        Здесь будут настройки вашего профиля (изменение пароля, email и т.д.).
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
