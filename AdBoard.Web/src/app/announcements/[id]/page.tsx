// AdBoard.Web/src/app/announcements/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAnnouncementById, getUserById } from "@/lib/api";
import { Announcement, UserProfile } from "@/types";
import styles from "./AnnouncementDetails.module.scss";
import { useUserContext } from "@/context/UserContext";

export default function AnnouncementPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user, toggleFavorite } = useUserContext();

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [seller, setSeller] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Некорректный идентификатор");
            return;
        }
        (async () => {
            try {
                const ann = await getAnnouncementById(id);
                setAnnouncement(ann);

                if (!ann.creatorId) {
                    setError("У объявления нет автора");
                    return;
                }

                if (user?.id === ann.creatorId) {
                    router.push("/profile");
                    return;
                }

                const userProfile = await getUserById(ann.creatorId);
                setSeller(userProfile);
            } catch {
                setError("Объявление или продавец не найден");
            }
        })();
    }, [id, user, router]);

    if (error) {
        return (
            <div className={styles.notFoundContainer}>
                <p className={styles.notFoundMessage}>{error}</p>
                <Link href="/" className={styles.backLink}>
                    ← На главную
                </Link>
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className={styles.loadingContainer}>
                <p>Загрузка объявления...</p>
            </div>
        );
    }

    const isFav =
        user?.favorites?.some((a) => a.id === announcement.id) ?? false;
    const isOwnProfile = user?.id === announcement.creatorId;
    const profileLink = isOwnProfile
        ? "/profile"
        : `/profile/${announcement.creatorId}`;

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.headerWithFavorite}>
                    <h1 className={styles.title}>{announcement.title}</h1>
                    <button
                        className={`${styles.favoriteButton} ${isFav ? styles.favorited : ""
                            }`}
                        onClick={() => toggleFavorite(announcement.id)}
                        aria-label={
                            isFav ? "Удалить из избранного" : "Добавить в избранное"
                        }
                        aria-pressed={isFav}
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3
                       19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
                </div>

                <div className={styles.price}>
                    {announcement.price.toLocaleString("ru-RU")} ₽
                </div>
                <div className={styles.city}>{announcement.city}</div>
                {announcement.subcategory && (
                    <div className={styles.categoryBlock}>
                        <span className={styles.label}>Категория:</span>
                        <div className={styles.chipList}>
                            <span className={styles.chip}>
                                {announcement.subcategory.category.name}
                            </span>
                            <span className={styles.chip}>
                                {announcement.subcategory.name}
                            </span>
                        </div>
                    </div>
                )}
                <div className={styles.createdAt}>
                    Опубликовано:{" "}
                    {new Date(announcement.createdAt).toLocaleDateString()}
                </div>
                <div className={styles.description}>
                    {announcement.description}
                </div>
            </main>

            {seller && (
                <aside className={styles.sellerCard}>
                    <div className={styles.sellerTitle}>Продавец</div>
                    <div className={styles.sellerInfoItem}>
                        {seller.name ?? seller.email.split("@")[0]}
                    </div>
                    {seller.phoneNumber && (
                        <div className={styles.sellerInfoItem}>
                            <b>Телефон:</b> {seller.phoneNumber}
                        </div>
                    )}
                    <div className={styles.sellerInfoItem}>
                        <b>Рейтинг:</b>{" "}
                        {seller.reviews?.length
                            ? (
                                seller.reviews.reduce((sum, r) => sum + r.score, 0) /
                                seller.reviews.length
                            ).toFixed(1)
                            : "—"}
                        {seller.reviews?.length ? ` (${seller.reviews.length})` : ""}
                    </div>
                    <Link href={profileLink} className={styles.sellerProfileLink}>
                        {isOwnProfile ? "Мой профиль и отзывы" : "Все отзывы и профиль"}
                    </Link>
                </aside>
            )}
        </div>
    );
}
