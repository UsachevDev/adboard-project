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
        categoryId: dto.id,
    })),
});

const SearchPage: React.FC = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q") || "";
    const categoryId = searchParams.get("categoryId") || undefined;
    const subcategoryId = searchParams.get("subcategoryId") || undefined;

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

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                // Получаем объявления с бэка, отфильтрованные по категории/подкатегории
                const anns = await getAnnouncements(categoryId, subcategoryId);

                let filtered = anns;
                let title = "Все объявления";

                // Поиск по тексту
                if (searchQuery) {
                    const lower = searchQuery.toLowerCase();
                    filtered = anns.filter((ann) =>
                        [ann.title, ann.description, ann.city]
                            .some((str) =>
                                str.toLowerCase().includes(lower)
                            )
                    );
                    title = `Результаты поиска для: "${searchQuery}"`;
                }

                // уточняем заголовок для подкатегории
                if (subcategoryId) {
                    // пробуем взять имя подкатегории из API
                    const apiSub = anns[0]?.subcategory;
                    const apiSubName = Array.isArray(apiSub)
                        ? apiSub[0]?.name
                        : apiSub?.name;
                    // если в API нет — из локального списка, иначе — сам id
                    const subName = apiSubName
                        ?? currentSubcategories.find(s => s.id === subcategoryId)?.name
                        ?? subcategoryId;
                    title = searchQuery
                        ? `Результаты "${searchQuery}" в подкатегории "${subName}"`
                        : `Объявления в подкатегории: "${subName}"`;
                }
                // или для категории
                else if (categoryId) {
                    // пробуем взять имя категории из вложенного объекта API
                    const apiSub = anns[0]?.subcategory;
                    const apiCatName = Array.isArray(apiSub)
                        ? apiSub[0]?.category?.[0]?.name
                        : apiSub?.category?.name;
                    const catName = apiCatName
                        ?? currentCategory?.name
                        ?? categoryId;
                    title = searchQuery
                        ? `Результаты "${searchQuery}" в категории "${catName}"`
                        : `Объявления в категории: "${catName}"`;
                }

                setResults(filtered);
                setPageTitle(title);
            } catch (err) {
                console.error("Ошибка загрузки объявлений:", err);
                setResults([]);
                setPageTitle("Ошибка при загрузке");
            } finally {
                setLoading(false);
            }
        })();
    }, [
        searchQuery,
        categoryId,
        subcategoryId,
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