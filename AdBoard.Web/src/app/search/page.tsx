// src/app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import styles from './SearchPage.module.scss';
import { Announcement, Subcategory, Category } from '@/types'; // Добавили Category
import AnnouncementCard from '@/components/ui/AnnouncementCard/AnnouncementCard';
import CategoryGrid from '@/components/ui/CategoryGrid/CategoryGrid';
import { getMockAnnouncements, mockCategories, mockSubcategories } from '@/lib/mockData';

const SearchPage: React.FC = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');

    const [results, setResults] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageTitle, setPageTitle] = useState('Результаты поиска');
    const [currentSubcategories, setCurrentSubcategories] = useState<Subcategory[]>([]);

    // Определяем текущую категорию для отображения ее подкатегорий
    const currentCategory = useMemo(() => {
        return categoryId ? mockCategories.find(cat => cat.id === categoryId) : undefined;
    }, [categoryId]);

    useEffect(() => {
        setLoading(true);

        // Получаем подкатегории, если есть выбранная категория
        if (currentCategory) {
            const relatedSubs = mockSubcategories.filter(sub => sub.categoryId === currentCategory.id);
            setCurrentSubcategories(relatedSubs);
        } else {
            setCurrentSubcategories([]); // Сбрасываем, если категории нет
        }

        const fetchAndFilterAnnouncements = () => {
            const allAnnouncements = getMockAnnouncements();
            let filtered: Announcement[] = allAnnouncements;
            let title = 'Все объявления';

            // 1. Фильтрация по поисковому запросу (если есть)
            if (searchQuery) {
                const lowerCaseQuery = searchQuery.toLowerCase();
                filtered = filtered.filter(announcement => {
                    const matchesTitle = announcement.title.toLowerCase().includes(lowerCaseQuery);
                    const matchesDescription = announcement.description.toLowerCase().includes(lowerCaseQuery);
                    const matchesCity = announcement.city.toLowerCase().includes(lowerCaseQuery);

                    // Проверка на совпадение с частью категории/подкатегории
                    const matchesCategoryPartially = announcement.categories && announcement.categories.some(category => category.name.toLowerCase().includes(lowerCaseQuery));
                    const matchesSubcategoryPartially = announcement.subcategories && announcement.subcategories.some(subcategory => subcategory.name.toLowerCase().includes(lowerCaseQuery));

                    // Расширенная логика для "купить/продать"
                    let isBuySellQuery = false;
                    let keywordFromPhrase = '';
                    if (lowerCaseQuery.startsWith('купить ') || lowerCaseQuery.startsWith('продать ')) {
                        isBuySellQuery = true;
                        keywordFromPhrase = lowerCaseQuery.split(' ').slice(1).join(' ');
                    }

                    const matchesKeywordInBuySellPhrase = keywordFromPhrase ?
                        (announcement.title.toLowerCase().includes(keywordFromPhrase) ||
                            announcement.description.toLowerCase().includes(keywordFromPhrase) ||
                            (announcement.categories && announcement.categories.some(c => c.name.toLowerCase().includes(keywordFromPhrase))) ||
                            (announcement.subcategories && announcement.subcategories.some(s => s.name.toLowerCase().includes(keywordFromPhrase))))
                        : false;

                    return matchesTitle || matchesDescription || matchesCity ||
                           matchesCategoryPartially || matchesSubcategoryPartially ||
                           (isBuySellQuery && matchesKeywordInBuySellPhrase);
                });
                title = `Результаты поиска для: "${searchQuery}"`;
            }

            // 2. Фильтрация по categoryId (если есть)
            if (categoryId) {
                filtered = filtered.filter(announcement =>
                    announcement.categories && announcement.categories.some(cat => cat.id === categoryId)
                );
                const categoryName = mockCategories.find(cat => cat.id === categoryId)?.name;
                // Если есть только categoryId, устанавливаем заголовок
                if (!subcategoryId && !searchQuery) { // Только если нет подкатегории и поискового запроса
                    title = `Объявления в категории: "${categoryName || categoryId}"`;
                } else if (searchQuery) { // Если есть и поисковый запрос
                     title = `Результаты по запросу "${searchQuery}" в категории "${categoryName || categoryId}"`;
                }
            }

            // 3. Фильтрация по subcategoryId (если есть)
            if (subcategoryId) {
                filtered = filtered.filter(announcement =>
                    announcement.subcategories && announcement.subcategories.some(sub => sub.id === subcategoryId)
                );
                const subcategoryName = mockSubcategories.find(sub => sub.id === subcategoryId)?.name;
                // Если есть подкатегория, она имеет приоритет для заголовка
                title = `Объявления в подкатегории: "${subcategoryName || subcategoryId}"`;
                // Если есть и поисковый запрос, добавляем его в заголовок
                if (searchQuery) {
                    title = `Результаты по запросу "${searchQuery}" в подкатегории "${subcategoryName || subcategoryId}"`;
                }
            }

            setResults(filtered);
            setPageTitle(title);
            setLoading(false);
        };

        const timer = setTimeout(fetchAndFilterAnnouncements, 300); // Задержка для дебаунса

        window.addEventListener('storage', fetchAndFilterAnnouncements);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('storage', fetchAndFilterAnnouncements);
        };
    }, [searchQuery, categoryId, subcategoryId, currentCategory]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{pageTitle}</h1>

            {currentCategory && currentSubcategories.length > 0 && (
                <>
                    <CategoryGrid items={currentSubcategories} basePath="/search" />
                    <hr className={styles.sectionDivider} />
                </>
            )}

            {loading ? (
                <p className={styles.message}>Загрузка...</p>
            ) : results.length > 0 ? (
                <div className={styles.resultsGrid}>
                    {results.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                </div>
            ) : (
                <p className={styles.message}>По вашему запросу ничего не найдено.</p>
            )}
        </div>
    );
};

export default SearchPage;
