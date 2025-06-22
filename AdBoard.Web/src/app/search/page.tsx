"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import CategoryGrid from "@/components/ui/CategoryGrid/CategoryGrid";
import { getMockAnnouncements } from "@/lib/mockData";
import { getCategories, CategoryDto } from "@/lib/api";
import { Announcement, Category, Subcategory } from "@/types";
import styles from "./SearchPage.module.scss";

const mapCategory = (dto: CategoryDto): Category => ({
    id: dto.id,
    name: dto.name,
    subcategories: dto.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        categoryId: dto.id,
    })),
});

const SearchPage: React.FC = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q") || "";
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");

    const [results, setResults] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState("Результаты поиска");
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories()
            .then((dtos: CategoryDto[]) => dtos.map(mapCategory))
            .then(setCategories)
            .catch((err) =>
                console.error("Не удалось загрузить категории:", err)
            );
    }, []);

    const currentCategory = useMemo(
        () => categories.find((c) => c.id === categoryId),
        [categories, categoryId]
    );
    const currentSubcategories: Subcategory[] = useMemo(
        () => currentCategory?.subcategories ?? [],
        [currentCategory]
    );

    // фильтрация объявлений
    useEffect(() => {
        setLoading(true);

        const fetchAndFilterAnnouncements = () => {
            let filtered = getMockAnnouncements();
            let title = "Все объявления";

            // Поиск по тексту
            if (searchQuery) {
                const lower = searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (ann) =>
                        [
                            ann.title.toLowerCase(),
                            ann.description.toLowerCase(),
                            ann.city.toLowerCase(),
                        ].some((str) => str.includes(lower)) ||
                        ann.categories?.some((c) =>
                            c.name.toLowerCase().includes(lower)
                        ) ||
                        ann.subcategories?.some((s) =>
                            s.name.toLowerCase().includes(lower)
                        )
                );
                title = `Результаты поиска для: "${searchQuery}"`;
            }

            // Фильтр по категории
            if (categoryId) {
                filtered = filtered.filter((ann) =>
                    ann.categories?.some((c) => c.id === categoryId)
                );
                const name = currentCategory?.name ?? categoryId;
                title = `Объявления в категории: "${name}"`;
                if (searchQuery) {
                    title = `Результаты "${searchQuery}" в категории "${name}"`;
                }
            }

            // Фильтр по подкатегории
            if (subcategoryId) {
                filtered = filtered.filter((ann) =>
                    ann.subcategories?.some((s) => s.id === subcategoryId)
                );
                const subName =
                    currentSubcategories.find((s) => s.id === subcategoryId)
                        ?.name ?? subcategoryId;
                title = `Объявления в подкатегории: "${subName}"`;
                if (searchQuery) {
                    title = `Результаты "${searchQuery}" в подкатегории "${subName}"`;
                }
            }

            setResults(filtered);
            setPageTitle(title);
            setLoading(false);
        };

        const timer = setTimeout(fetchAndFilterAnnouncements, 300);
        window.addEventListener("storage", fetchAndFilterAnnouncements);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("storage", fetchAndFilterAnnouncements);
        };
    }, [
        searchQuery,
        categoryId,
        subcategoryId,
        categories,
        currentCategory,
        currentSubcategories,
    ]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{pageTitle}</h1>

            {currentCategory && currentSubcategories.length > 0 && (
                <>
                    <CategoryGrid
                        items={currentSubcategories}
                        basePath="/search"
                    />
                    <hr className={styles.sectionDivider} />
                </>
            )}

            {loading ? (
                <p className={styles.message}>Загрузка...</p>
            ) : results.length > 0 ? (
                <div className={styles.resultsGrid}>
                    {results.map((ann) => (
                        <AnnouncementCard key={ann.id} announcement={ann} />
                    ))}
                </div>
            ) : (
                <p className={styles.message}>
                    По вашему запросу ничего не найдено.
                </p>
            )}
        </div>
    );
};

export default SearchPage;
