"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./ProfilePage.module.scss";
import { getCurrentUser } from "@/lib/api";
import EditProfileForm from "@/components/ui/Profile/EditProfileForm";
import { UserProfile, Announcement } from "@/types";
import Avatar from "@/components/ui/Avatar/Avatar";

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [userAnnouncements, setUserAnnouncements] = useState<Announcement[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const loadUserProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const profile = await getCurrentUser();
            setUserData(profile);
            setUserAnnouncements(profile.announcements ?? []);
            localStorage.setItem("user_name", profile.name ?? "");
            window.dispatchEvent(new Event("storage"));
        } catch (err: unknown) {
            console.error("Ошибка загрузки профиля:", err);
            const msg =
                err instanceof Error
                    ? err.message
                    : "Ошибка при загрузке профиля.";
            setError(msg);
            if (msg.includes("Unauthorized")) router.push("/");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        loadUserProfile();
    }, [loadUserProfile]);

    const handleProfileSave = (): void => {
        setIsEditing(false);
        loadUserProfile();
    };

    const handleEditCancel = (): void => {
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
                <p className={`${styles.welcomeMessage} ${styles.error}`}>
                    {error}
                </p>
                <p className={styles.loginPrompt}>
                    Пожалуйста, войдите в систему.
                </p>
            </div>
        );
    }
    if (!userData) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Требуется авторизация</h1>
                <p className={styles.loginPrompt}>
                    Для просмотра профиля нажмите «Войти».
                </p>
            </div>
        );
    }

    const displayName =
        userData.name ??
        (typeof userData.email === "string"
            ? userData.email.split("@")[0]
            : "Пользователь");

    return (
        <div className={styles.container}>
            {isEditing ? (
                <EditProfileForm
                    initialData={userData}
                    onSave={handleProfileSave}
                    onCancel={handleEditCancel}
                />
            ) : (
                <>
                    <div className={styles.profileHeader}>
                        <div className={styles.profileHeaderAvatar}>
                            <Avatar name={displayName} size="5rem" />
                        </div>
                        <h1 className={styles.profileHeaderTitle}>
                            Привет, {displayName}!
                        </h1>
                    </div>
                    <p className={styles.welcomeMessage}>
                        Добро пожаловать в ваш кабинет AdBoard.
                    </p>

                    <h2 className={styles.sectionTitle}>
                        Мои объявления ({userAnnouncements.length})
                    </h2>
                    <div className={styles.announcementsGrid}>
                        {userAnnouncements.length > 0 ? (
                            userAnnouncements.map((ann) => (
                                <div
                                    key={ann.id}
                                    className={styles.announcementItem}
                                >
                                    <h3>{ann.title}</h3>
                                    <p>{ann.description.slice(0, 100)}...</p>
                                    <p>Цена: {ann.price} руб.</p>
                                    <p>Город: {ann.city}</p>
                                    <Link
                                        href={`/announcements/${ann.id}`}
                                        className={styles.viewAnnouncementLink}
                                    >
                                        Подробнее
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className={styles.placeholder}>
                                <p>У вас ещё нет объявлений.</p>
                                <Link
                                    href="/add-announcement"
                                    className={styles.addAnnouncementLink}
                                >
                                    Подать первое
                                </Link>
                            </div>
                        )}
                    </div>

                    <h2 className={styles.sectionTitle}>Настройки аккаунта</h2>
                    <div className={styles.infoBlock}>
                        <p>
                            <span>Email:</span> {userData.email}
                        </p>
                        {userData.phoneNumber && (
                            <p>
                                <span>Телефон:</span> {userData.phoneNumber}
                            </p>
                        )}
                        {userData.city && (
                            <p>
                                <span>Город:</span> {userData.city}
                            </p>
                        )}
                        {userData.createdAt && (
                            <p>
                                <span>Дата регистрации:</span>{" "}
                                {new Date(
                                    userData.createdAt
                                ).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    <div className={styles.editButtonContainer}>
                        <button
                            className={styles.editProfileButton}
                            onClick={() => setIsEditing(true)}
                        >
                            Редактировать профиль
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
