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

    const handleFavClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        await toggleFavorite(announcement.id);
    };

    return (
        <div className={styles.card}>
            {/* Кнопка избранного вне области клика по карточке */}
            <div className={styles.favorite}>
                <button
                    className={styles.favoriteButton}
                    onClick={handleFavClick}
                    aria-label={
                        isFav ? "Удалить из избранного" : "Добавить в избранное"
                    }
                    aria-pressed={isFav}
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>

            {/* Вся кликабельная область карточки */}
            <div
                className={styles.body}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
            >
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
                                    .map((sub) => sub.name)
                                    .join(", ")}
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;
