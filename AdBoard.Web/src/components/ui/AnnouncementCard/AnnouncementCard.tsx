// AdBoard.Web/src/components/ui/AnnouncementCard/AnnouncementCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Announcement } from "@/types";
import styles from "./AnnouncementCard.module.scss";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

interface AnnouncementCardProps {
    announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
    const router = useRouter();
    const { user, toggleFavorite } = useUserContext();
    const isFav = user?.favorites?.some((a) => a.id === announcement.id) ?? false;

    const category =
        announcement.category || announcement.subcategory?.category;
    const subcategory = announcement.subcategory;

    const handleCardClick = () => {
        router.push(`/announcements/${announcement.id}`);
    };

    const handleFavClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        await toggleFavorite(announcement.id);
    };

    return (
        <div
            className={styles.card}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.favorite}>
                <button
                    className={`${styles.favoriteButton} ${isFav ? styles.favorited : ""}`}
                    onClick={handleFavClick}
                    aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
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

            <div className={styles.body}>
                <div className={styles.imageWrapper}>
                    {announcement.images?.length ? (
                        <Image
                            src={announcement.images[0]}
                            alt={announcement.title}
                            width={300}
                            height={200}
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className={styles.noImage}>Нет фото</div>
                    )}
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title}>{announcement.title}</h3>
                    <p className={styles.price}>
                        {announcement.price.toLocaleString("ru-RU")} ₽
                    </p>
                    <p className={styles.city}>{announcement.city}</p>
                    {(category || subcategory) && (
                        <p className={styles.categories}>
                            {category && (
                                <Link
                                    href={`/search?categoryId=${category.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className={styles.categoryBadge}
                                >
                                    {category.name}
                                </Link>
                            )}
                            {subcategory && (
                                <>
                                    {" / "}
                                    <Link
                                        href={`/search?subcategoryId=${subcategory.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className={styles.subcategoryBadge}
                                    >
                                        {subcategory.name}
                                    </Link>
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;
