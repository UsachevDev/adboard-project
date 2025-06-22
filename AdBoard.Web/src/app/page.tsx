"use client";

import React, { useEffect, useState } from "react";
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import CategoryGrid from "@/components/ui/CategoryGrid/CategoryGrid";
import { getMockAnnouncements } from "@/lib/mockData";
import { getCategories, CategoryDto } from "@/lib/api";
import { Announcement, Category } from "@/types";
import styles from "@/styles/pages/Home.module.scss";

const mapCategory = (dto: CategoryDto): Category => ({
    id: dto.id,
    name: dto.name,
    subcategories: dto.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        categoryId: dto.id,
    })),
});

export default function HomePage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchAnnouncements = () => {
            const all = getMockAnnouncements();
            const latest = all
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .slice(0, 12);
            setAnnouncements(latest);
        };

        fetchAnnouncements();
        window.addEventListener("storage", fetchAnnouncements);
        return () => {
            window.removeEventListener("storage", fetchAnnouncements);
        };
    }, []);

    useEffect(() => {
        getCategories()
            .then((dtos: CategoryDto[]) => dtos.map(mapCategory))
            .then(setCategories)
            .catch((err) =>
                console.error("Не удалось загрузить категории:", err)
            );
    }, []);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <CategoryGrid
                    items={categories}
                    basePath="/search"
                    isCategoryGrid={true}
                />

                <hr className={styles.sectionDivider} />

                <h1 className={styles.title}>Последние объявления</h1>
                <div className={styles.grid}>
                    {announcements.length > 0 ? (
                        announcements.map((ann) => (
                            <AnnouncementCard key={ann.id} announcement={ann} />
                        ))
                    ) : (
                        <p className={styles.noAnnouncementsMessage}>
                            Объявлений пока нет.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
