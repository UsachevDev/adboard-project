"use client";

import React from "react";
import Image from "next/image";
import { Announcement } from "@/types";
import styles from "./AnnouncementCard.module.scss";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

interface AnnouncementCardProps {
    announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
    announcement,
}) => {
    const router = useRouter();
    const { favSet, toggleFavorite } = useUserContext();
    const isFav = favSet.has(announcement.id);

    const handleCardClick = () => {
        router.push(`/announcements/${announcement.id}`);
    };

    const handleFavClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(announcement.id);
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
                    className={styles.favoriteButton}
                    onClick={handleFavClick}
                    aria-label={
                        isFav ? "Удалить из избранного" : "Добавить в избранное"
                    }
                >
                    {isFav ? "❤️" : "🤍"}
                </button>
            </div>
            <div className={styles.imageWrapper}>
                {announcement.images && announcement.images.length > 0 ? (
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
                {announcement.categories &&
                    announcement.categories.length > 0 && (
                        <p className={styles.categories}>
                            Категория:{" "}
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
                                .map((subcat) => subcat.name)
                                .join(", ")}
                        </p>
                    )}
            </div>
        </div>
    );
};

export default AnnouncementCard;
