"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import CategoryGrid from "@/components/ui/CategoryGrid/CategoryGrid";
import { getAnnouncements, getCategories, CategoryDto } from "@/lib/api";
import { Announcement, Category, Subcategory } from "@/types";
import styles from "@/styles/pages/Home.module.scss";

const BATCH_SIZE = 12;

const mapCategory = (dto: CategoryDto): Category => ({
    id: dto.id,
    name: dto.name,
    subcategories: dto.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        category: { id: dto.id, name: dto.name },
    })),
});

export default function HomePage() {
    const [allAnns, setAllAnns] = useState<Announcement[]>([]);
    const [displayedAnns, setDisplayedAnns] = useState<Announcement[]>([]);
    const [cats, setCats] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const mapAnnouncements = (
        anns: Announcement[],
        categories: Category[]
    ): Announcement[] => {
        const subs: Subcategory[] = categories.flatMap(
            (c) => c.subcategories ?? []
        );
        return anns.map((ann) => {
            const sub = subs.find((s) => s.id === ann.subcategoryId);
            return {
                ...ann,
                subcategory: sub,
                category: sub?.category,
            };
        });
    };

    useEffect(() => {
        (async () => {
            try {
                const [annsRaw, dtos] = await Promise.all([
                    getAnnouncements(),
                    getCategories(),
                ]);
                const categories = dtos.map(mapCategory);
                const mappedAnns = mapAnnouncements(annsRaw, categories);
                setCats(categories);
                setAllAnns(mappedAnns);
                setDisplayedAnns(mappedAnns.slice(0, BATCH_SIZE));
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error(
                    "Не удалось загрузить объявления или категории:",
                    msg
                );
                setError(msg);
                setCats([]);
                setAllAnns([]);
                setDisplayedAnns([]);
            }
        })();
    }, []);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (
                target.isIntersecting &&
                displayedAnns.length < allAnns.length
            ) {
                const nextSlice = allAnns.slice(
                    displayedAnns.length,
                    displayedAnns.length + BATCH_SIZE
                );
                setDisplayedAnns((prev) => [...prev, ...nextSlice]);
            }
        },
        [allAnns, displayedAnns.length]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "200px",
            threshold: 0.1,
        });
        const current = loaderRef.current;
        if (current) observer.observe(current);
        return () => {
            if (current) observer.unobserve(current);
        };
    }, [handleObserver]);

    if (error) {
        return (
            <div className={styles.container}>
                <p className={styles.error}>Ошибка загрузки: {error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <CategoryGrid items={cats} basePath="/search" isCategoryGrid />

                <hr className={styles.sectionDivider} />

                <h1 className={styles.title}>Объявления</h1>
                <div className={styles.grid}>
                    {displayedAnns.map((ann) => (
                        <AnnouncementCard key={ann.id} announcement={ann} />
                    ))}
                </div>

                <div ref={loaderRef} className={styles.loader}>
                    {displayedAnns.length < allAnns.length ? (
                        <p>Загрузка объявлений…</p>
                    ) : (
                        <p></p>
                    )}
                </div>
            </main>
        </div>
    );
}
