"use client";

import React, { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import styles from "./FavoritesPage.module.scss";

export default function FavoritesPage() {
    const { user, refreshUser, toggleFavorite } = useUserContext();

    // при загрузке страницы подтягиваем актуальные favorites из БД
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const favs = user?.favorites ?? [];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Избранное</h1>

            {favs.length > 0 ? (
                <div className={styles.grid}>
                    {favs.map((ann) => (
                        <div key={ann.id} className={styles.cardWrapper}>
                            <AnnouncementCard announcement={ann} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.emptyMessage}>
                    У вас нет избранных объявлений.
                </p>
            )}
        </div>
    );
}