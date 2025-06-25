"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAnnouncementById } from "@/lib/api";
import { Announcement } from "@/types";
import { getUserById } from "@/lib/api";
import { UserProfile } from "@/types";
import styles from "./AnnouncementDetails.module.scss";
import { useUserContext } from "@/context/UserContext";

export default function AnnouncementPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [seller, setSeller] = useState<UserProfile | null>(null);
    const { favSet, toggleFavorite } = useUserContext();

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

                const user = await getUserById(ann.creatorId);
                setSeller(user);
            } catch {
                setError("Объявление или продавец не найден");
            }
        })();
    }, [id]);

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

    const isFav = favSet.has(announcement.id);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.headerWithFavorite}>
                    <h1 className={styles.title}>{announcement.title}</h1>
                    <button
                        className={styles.detailFavoriteButton}
                        onClick={() => toggleFavorite(announcement.id)}
                        aria-label={
                            isFav
                                ? "Удалить из избранного"
                                : "Добавить в избранное"
                        }
                    >
                        {isFav ? "❤️" : "🤍"}
                    </button>
                </div>

                <p className={styles.price}>
                    {announcement.price.toLocaleString("ru-RU")} ₽
                </p>
                <p className={styles.city}>{announcement.city}</p>
                <p className={styles.description}>{announcement.description}</p>

                {announcement.images && announcement.images.length > 0 && (
                    <div className={styles.imageGallery}>
                        {announcement.images.map((src, idx) => (
                            <div key={idx} className={styles.imageWrapper}>
                                <Image
                                    src={src}
                                    alt={`${announcement.title} #${idx + 1}`}
                                    width={600}
                                    height={400}
                                    style={{ objectFit: "contain" }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {announcement.categories &&
                    announcement.categories.length > 0 && (
                        <p className={styles.categories}>
                            Категории:{" "}
                            {announcement.categories
                                .map((cat) => cat.name)
                                .join(", ")}
                        </p>
                    )}
                {announcement.subcategories &&
                    announcement.subcategories.length > 0 && (
                        <p className={styles.subcategories}>
                            Подкатегории:{" "}
                            {announcement.subcategories
                                .map((sub) => sub.name)
                                .join(", ")}
                        </p>
                    )}

                <p className={styles.createdAt}>
                    Опубликовано:{" "}
                    {new Date(announcement.createdAt).toLocaleDateString()}
                </p>

                {seller && (
                    <section className={styles.sellerInfo}>
                        <h3>Продавец</h3>
                        <div>
                            <b>Имя:</b>{" "}
                            {seller.name ?? seller.email.split("@")[0]}
                        </div>
                        {seller.phoneNumber && (
                            <div>
                                <b>Телефон:</b> {seller.phoneNumber}
                            </div>
                        )}
                        <div>
                            <b>Рейтинг:</b>{" "}
                            {seller.reviews?.length
                                ? (
                                      seller.reviews.reduce(
                                          (sum, r) => sum + r.score,
                                          0
                                      ) / seller.reviews.length
                                  ).toFixed(1)
                                : "—"}
                            {seller.reviews?.length
                                ? ` (${seller.reviews.length})`
                                : ""}
                        </div>
                        {seller && announcement.creatorId && (
                            <Link href={`/profile/${announcement.creatorId}`}>
                                Все отзывы и профиль
                            </Link>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
