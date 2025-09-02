"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import CategoryGrid from "@/components/ui/CategoryGrid/CategoryGrid";
import { getAnnouncements, getCategories, CategoryDto } from "@/lib/api";
import { Announcement, Category, Subcategory } from "@/types";
import styles from "./SearchPage.module.scss";

const mapCategory = (dto: CategoryDto): Category => ({
    id: dto.id,
    name: dto.name,
    subcategories: dto.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        category: { id: dto.id, name: dto.name },
    })),
});

const SearchPage: React.FC = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q") || "";
    const categoryId = searchParams.get("categoryId") || undefined;
    const subcategoryId =
        searchParams.get("subcategoryId") || undefined;

    const [categories, setCategories] = useState<Category[]>([]);
    const [results, setResults] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState("Результаты поиска");

    useEffect(() => {
        getCategories()
            .then((dtos) => dtos.map(mapCategory))
            .then(setCategories)
            .catch((e) =>
                console.error("Не удалось загрузить категории:", e)
            );
    }, []);

    const allSubcategories = useMemo<Subcategory[]>(
        () => categories.flatMap((c) => c.subcategories ?? []),
        [categories]
    );

    useEffect(() => {
        if (!categories.length) return;
        setLoading(true);

        (async () => {
            try {
                const anns = await getAnnouncements(
                    categoryId,
                    subcategoryId
                );

                let filtered = anns;
                if (searchQuery) {
                    const lower = searchQuery.toLowerCase();
                    filtered = anns.filter((ann) =>
                        [ann.title, ann.description, ann.city].some((str) =>
                            str.toLowerCase().includes(lower)
                        )
                    );
                }
                const mapped = filtered.map((ann) => {
                    const sub = allSubcategories.find(
                        (s) => s.id === ann.subcategoryId
                    );
                    return {
                        ...ann,
                        subcategory: sub,
                        category: sub?.category,
                    };
                });
                setResults(mapped);
            } catch (e) {
                console.error("Ошибка загрузки объявлений:", e);
                setResults([]);
            } finally {
                setLoading(false);
            }
        })();

        let title = "Все объявления";

        if (subcategoryId) {
            const sub = allSubcategories.find(
                (s) => s.id === subcategoryId
            );
            const name = sub?.name ?? subcategoryId;
            title = searchQuery
                ? `Результаты "${searchQuery}" в подкатегории "${name}"`
                : `Объявления в подкатегории: "${name}"`;
        } else if (categoryId) {
            const cat = categories.find((c) => c.id === categoryId);
            const name = cat?.name ?? categoryId;
            title = searchQuery
                ? `Результаты "${searchQuery}" в категории "${name}"`
                : `Объявления в категории: "${name}"`;
        } else if (searchQuery) {
            title = `Результаты поиска для: "${searchQuery}"`;
        }

        setPageTitle(title);
    }, [
        searchQuery,
        categoryId,
        subcategoryId,
        categories,
        allSubcategories,
    ]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{pageTitle}</h1>

            {categoryId && allSubcategories.length > 0 && (
                <>
                    <CategoryGrid
                        items={allSubcategories.filter(
                            (s) => s.category.id === categoryId
                        )}
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
                        <AnnouncementCard
                            key={ann.id}
                            announcement={ann}
                        />
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
