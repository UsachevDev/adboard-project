"use client";

import React from "react";
import { useUserContext } from "@/context/UserContext";
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import styles from "./FavoritesPage.module.scss";

export default function FavoritesPage() {
    const { user } = useUserContext();
    const favs = user?.favourites ?? [];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Избранное</h1>
            {favs.length > 0 ? (
                <div className={styles.grid}>
                    {favs.map((ann) => (
                        <AnnouncementCard key={ann.id} announcement={ann} />
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
