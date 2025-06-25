"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/lib/api";
import { UserProfile } from "@/types";
import Avatar from "@/components/ui/Avatar/Avatar";
import UserReviews from "@/components/ui/Profile/UserReviews";
import styles from "../ProfilePage.module.scss"; // можно заиспользовать старые стили

const ProfileByIdPage: React.FC = () => {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [user, setUser] = useState<UserProfile | null>(null);
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
            } catch {
                setError("Профиль не найден");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading)
        return <div className={styles.container}>Загрузка профиля...</div>;
    if (error) return <div className={styles.container}>{error}</div>;
    if (!user)
        return <div className={styles.container}>Профиль не найден.</div>;

    const displayName = user.name ?? user.email.split("@")[0] ?? "Пользователь";

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <div className={styles.profileHeaderAvatar}>
                    <Avatar name={displayName} size="5rem" />
                </div>
                <h1 className={styles.profileHeaderTitle}>{displayName}</h1>
            </div>
            <UserReviews user={user} />
            <Link href={`/profile/${id}/reviews`}>
                <button className={styles.allReviewsBtn}>Все отзывы</button>
            </Link>
            <div className={styles.infoBlock}>
                <p>
                    <span>Email:</span> {user.email}
                </p>
                {user.phoneNumber && (
                    <p>
                        <span>Телефон:</span> {user.phoneNumber}
                    </p>
                )}
                {user.city && (
                    <p>
                        <span>Город:</span> {user.city}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileByIdPage;
