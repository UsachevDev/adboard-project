"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import styles from "./ProfilePage.module.scss";
import { getCurrentUser, updateAnnouncement } from "@/lib/api";
import EditProfileForm from "@/components/ui/Profile/EditProfileForm";
import EditAnnouncementModal from "@/components/ui/Profile/EditAnnouncementModal";
import { useUserContext } from "@/context/UserContext";
import Avatar from "@/components/ui/Avatar/Avatar";
import UserReviews from "@/components/ui/Profile/UserReviews";
import { UserProfile, Announcement } from "@/types";

const ProfilePage: React.FC = () => {
    const { refreshUser } = useUserContext();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [userAnnouncements, setUserAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const profile = await getCurrentUser();
            setUserData(profile);
            setUserAnnouncements(profile.announcements ?? []);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Ошибка при загрузке профиля.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleProfileSave = async () => {
        setIsEditing(false);
        await refreshUser();
        await loadProfile();
    };

    const toggleHidden = async (ann: Announcement) => {
        try {
            await updateAnnouncement(ann.id, { isHidden: !ann.isHidden });
            await loadProfile();
        } catch (e) {
            console.error("Ошибка при изменении статуса скрытия объявления:", e);
        }
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
                <p className={styles.error}>{error}</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className={styles.container}>
                <p>Требуется авторизация.</p>
            </div>
        );
    }

    const displayName = userData.name ?? (userData.email.split("@")[0] || "Пользователь");

    return (
        <div className={styles.container}>
            {isEditing ? (
                <EditProfileForm
                    initialData={userData}
                    onSave={handleProfileSave}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <div className={styles.profileHeader}>
                        <div className={styles.profileHeaderAvatar}>
                            <Avatar name={displayName} size="5rem" />
                        </div>
                        <h1 className={styles.profileHeaderTitle}>Привет, {displayName}!</h1>
                    </div>

                    <UserReviews user={userData} />

                    <h2 className={styles.sectionTitle}>
                        Мои объявления ({userAnnouncements.length})
                    </h2>
                    {userAnnouncements.length > 0 ? (
                        <div className={styles.announcementsGrid}>
                            {userAnnouncements.map((ann) => (
                                <div
                                    key={ann.id}
                                    className={styles.announcementItem}
                                >
                                    <h3 className={styles.announcementTitle}>
                                        {ann.title}
                                    </h3>
                                    <p className={styles.announcementDesc}>
                                        {ann.description.slice(0, 100)}...
                                    </p>
                                    <p className={styles.announcementInfo}>
                                        Цена: {ann.price}
                                    </p>
                                    <p className={styles.announcementInfo}>
                                        Город: {ann.city}
                                    </p>
                                    <Link
                                        href={`/announcements/${ann.id}`}
                                        className={styles.viewAnnouncementLink}
                                    >
                                        Подробнее
                                    </Link>

                                    <div className={styles.announcementActions}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => {
                                                setEditingAnn(ann);
                                                setShowModal(true);
                                            }}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className={styles.toggleHiddenButton}
                                            onClick={() => toggleHidden(ann)}
                                        >
                                            {ann.isHidden ? "Показать" : "Скрыть"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    </div>

                    <div className={styles.editButtonContainer}>
                        <button
                            className={styles.editProfileButton}
                            onClick={() => setIsEditing(true)}
                        >
                            Редактировать профиль
                        </button>
                    </div>

                    {showModal && editingAnn && (
                        <EditAnnouncementModal
                            announcement={editingAnn}
                            onClose={() => setShowModal(false)}
                            onUpdated={async () => {
                                setShowModal(false);
                                await loadProfile();
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ProfilePage;
