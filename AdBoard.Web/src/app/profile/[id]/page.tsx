"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/lib/api";
import { UserProfile, Announcement } from "@/types";
import Avatar from "@/components/ui/Avatar/Avatar";
import UserReviews from "@/components/ui/Profile/UserReviews";
import styles from "../ProfilePage.module.scss";

const ProfileByIdPage: React.FC = () => {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userAnnouncements, setUserAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Некорректный идентификатор");
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const userProfile = await getUserById(id);
                setUser(userProfile);
                setUserAnnouncements(userProfile.announcements ?? []);
            } catch {
                setError("Профиль не найден");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return <div className={styles.container}>Загрузка профиля...</div>;
    }
    if (error) {
        return <div className={styles.container}>{error}</div>;
    }
    if (!user) {
        return <div className={styles.container}>Профиль не найден.</div>;
    }

    const displayName = user.name ?? user.email.split("@")[0] ?? "Пользователь";

    return (
        <div className={styles.container}>
            {/* header */}
            <div className={styles.profileHeader}>
                <div className={styles.profileHeaderAvatar}>
                    <Avatar name={displayName} size="5rem" />
                </div>
                <h1 className={styles.profileHeaderTitle}>{displayName}</h1>
            </div>

            {/* отзывы */}
            <UserReviews user={user} />
            <Link href={`/profile/${id}/reviews`}>
                <button className={styles.allReviewsBtn}>Все отзывы</button>
            </Link>

            {/* информация о пользователе */}
            <div className={styles.infoBlock}>
                {user.phoneNumber && <p><span>Телефон:</span> {user.phoneNumber}</p>}
            </div>

            {/* список объявлений продавца */}
            <h2 className={styles.sectionTitle}>
                Объявления продавца ({userAnnouncements.length})
            </h2>
            {userAnnouncements.length > 0 ? (
                <div className={styles.announcementsGrid}>
                    {userAnnouncements.map((ann) => (
                        <div key={ann.id} className={styles.announcementItem}>
                            <h3 className={styles.announcementTitle}>{ann.title}</h3>
                            <p className={styles.announcementDesc}>
                                {ann.description.length > 100
                                    ? `${ann.description.slice(0, 100)}…`
                                    : ann.description}
                            </p>
                            <p className={styles.announcementInfo}>Цена: {ann.price}</p>
                            <p className={styles.announcementInfo}>Город: {ann.city}</p>
                            <Link
                                href={`/announcements/${ann.id}`}
                                className={styles.viewAnnouncementLink}
                            >
                                Подробнее
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.placeholder}>
                    <p>У этого пользователя ещё нет объявлений.</p>
                </div>
            )}
        </div>
    );
};

export default ProfileByIdPage;
