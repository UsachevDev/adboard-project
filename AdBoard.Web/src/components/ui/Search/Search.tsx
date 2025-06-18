'use client';

import React, { useState, FormEvent, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import styles from './Search.module.scss';
import { mockCategories, mockSubcategories } from '@/lib/mockData';
import { Category, Subcategory } from '@/types';

interface SearchSuggestion {
    type: 'category' | 'subcategory' | 'common_phrase';
    value: string;
    id?: string;
}

const generateAllSuggestions = (): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = [];

    mockCategories.forEach(cat => {
        suggestions.push({ type: 'category', value: cat.name, id: cat.id });
    });

    mockSubcategories.forEach(subcat => {
        suggestions.push({ type: 'subcategory', value: subcat.name, id: subcat.id });
    });

    const commonPhrases: string[] = [
        'Купить квартиру', 'Арендовать дом', 'Продать авто', 'Ремонт ноутбуков',
        'Продать iPhone', 'Купить электронику', 'Обмен авто', 'Мотоциклы купить', 'Купить BMW', 'Ремонт iPhone'
    ];
    commonPhrases.forEach(phrase => {
        suggestions.push({ type: 'common_phrase', value: phrase });
    });

    const uniqueSuggestionsMap = new Map<string, SearchSuggestion>();
    suggestions.forEach(s => {
        if (!uniqueSuggestionsMap.has(s.value.toLowerCase())) {
            uniqueSuggestionsMap.set(s.value.toLowerCase(), s);
        }
    });

    return Array.from(uniqueSuggestionsMap.values());
};

const ALL_SEARCH_SUGGESTIONS = generateAllSuggestions();

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [isCategoriesPanelOpen, setIsCategoriesPanelOpen] = useState<boolean>(false);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [justNavigated, setJustNavigated] = useState<boolean>(false); // <-- НОВОЕ СОСТОЯНИЕ

    const searchWrapperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Этот useEffect отвечает за инициализацию поля поиска при изменении URL.
    // Он также гарантирует, что все модалки/панели закрыты при изменении URL.
    useEffect(() => {
        const currentQuery = searchParams.get('q') || '';
        const currentCategoryId = searchParams.get('categoryId');
        const currentSubcategoryId = searchParams.get('subcategoryId');

        if (currentCategoryId) {
            const category = mockCategories.find(c => c.id === currentCategoryId);
            setQuery(category ? category.name : '');
        } else if (currentSubcategoryId) {
            const subcategory = mockSubcategories.find(s => s.id === currentSubcategoryId);
            setQuery(subcategory ? subcategory.name : '');
        } else {
            setQuery(currentQuery);
        }
        setIsCategoriesPanelOpen(false);
        setShowSuggestions(false);
        setJustNavigated(false);
    }, [pathname, searchParams]);

    // Этот useEffect управляет отображением подсказок при *вводе* пользователя.
    useEffect(() => {
        if (justNavigated) {
            setJustNavigated(false);
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const handler = setTimeout(() => {
            const trimmedQuery = query.trim();

            if (searchInputRef.current !== document.activeElement && !showSuggestions) {
                 setSuggestions([]);
                 setShowSuggestions(false);
                 return;
            }

            if (trimmedQuery.length > 1) {
                const filtered = ALL_SEARCH_SUGGESTIONS.filter(suggestion =>
                    suggestion.value.toLowerCase().includes(trimmedQuery.toLowerCase())
                ).slice(0, 7);
                setSuggestions(filtered);
                setShowSuggestions(true);
            } else if (trimmedQuery.length === 0 && document.activeElement === searchInputRef.current) {
                setSuggestions(ALL_SEARCH_SUGGESTIONS.slice(0, 5));
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
            setIsCategoriesPanelOpen(false);
        }, 200);

        return () => {
            clearTimeout(handler);
        };
    }, [query, showSuggestions, justNavigated]);

    // Обработка кликов вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setIsCategoriesPanelOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Управление прокруткой body
    useEffect(() => {
        if (isCategoriesPanelOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCategoriesPanelOpen]);


    const handleSubmit = useCallback((event: FormEvent) => {
        event.preventDefault();
        if (query.trim()) {
            setJustNavigated(true);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setShowSuggestions(false);
            setIsCategoriesPanelOpen(false);
        }
    }, [query, router]);

    const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
        setQuery(suggestion.value);
        let url = `/search?q=${encodeURIComponent(suggestion.value.trim())}`;
        if (suggestion.type === 'category' && suggestion.id) {
            url = `/search?categoryId=${encodeURIComponent(suggestion.id)}`;
        } else if (suggestion.type === 'subcategory' && suggestion.id) {
            url = `/search?subcategoryId=${encodeURIComponent(suggestion.id)}`;
        }
        setJustNavigated(true);
        router.push(url);
        setShowSuggestions(false);
        setIsCategoriesPanelOpen(false);
    }, [router]);


    const handleInputFocus = useCallback(() => {
        setIsCategoriesPanelOpen(false);
        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0) {
            setSuggestions(ALL_SEARCH_SUGGESTIONS.slice(0, 5));
        } else {
            const filtered = ALL_SEARCH_SUGGESTIONS.filter(suggestion =>
                suggestion.value.toLowerCase().includes(trimmedQuery.toLowerCase())
            ).slice(0, 7);
            setSuggestions(filtered);
        }
        setShowSuggestions(true);
    }, [query]);

    const handleToggleCategoriesPanel = useCallback(() => {
        setIsCategoriesPanelOpen(prevState => {
            const newState = !prevState;
            if (newState && mockCategories.length > 0) {
                setActiveCategoryId(mockCategories[0].id);
                setShowSuggestions(false);
            } else {
                setActiveCategoryId(null);
            }
            return newState;
        });
    }, []);

    const handleCategoryOrSubcategorySelect = useCallback((item: Category | Subcategory, type: 'category' | 'subcategory') => {
        setQuery(item.name);
        let url = `/search?q=${encodeURIComponent(item.name.trim())}`;
        if (type === 'category') {
            url = `/search?categoryId=${encodeURIComponent(item.id)}`;
        } else if (type === 'subcategory') {
            url = `/search?subcategoryId=${encodeURIComponent(item.id)}`;
        }
        setJustNavigated(true);
        router.push(url);
        setIsCategoriesPanelOpen(false);
        setShowSuggestions(false);
    }, [router]);

    const panelTopPosition = searchWrapperRef.current
        ? searchWrapperRef.current.offsetTop + searchWrapperRef.current.offsetHeight
        : 0;

    const filteredSubcategories = activeCategoryId
        ? mockSubcategories.filter(sub => sub.categoryId === activeCategoryId)
        : [];

    return (
        <div className={styles.searchWrapper} ref={searchWrapperRef}>
            <div className={styles.container}>
                <div className={styles.searchControls}>
                    <button
                        type="button"
                        className={styles.browseCategoriesButton}
                        onClick={handleToggleCategoriesPanel}
                    >
                        Все категории
                    </button>

                    <div className={styles.inputAndSuggestions}>
                        <form onSubmit={handleSubmit} className={styles.searchForm}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={handleInputFocus}
                                placeholder="Искать объявления..."
                                className={styles.searchInput}
                                autoComplete="off"
                                aria-label="Search announcements"
                                ref={searchInputRef}
                            />
                            <button type="submit" className={styles.searchButton}>
                                Поиск
                            </button>
                        </form>

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className={styles.suggestionsList}>
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className={styles.suggestionItem}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion.value}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {isCategoriesPanelOpen && (
                <>
                    <div
                        className={styles.categoriesOverlay}
                        onClick={() => setIsCategoriesPanelOpen(false)}
                        style={{ top: `${panelTopPosition}px`, height: `calc(100vh - ${panelTopPosition}px)` }}
                    />

                    <div className={styles.categoriesPanel} style={{ top: `${panelTopPosition}px` }}>
                        <div className={styles.categoriesPanelContent}>
                            <div className={styles.mainAndSubcategoriesContainer}>
                                <ul className={styles.mainCategoriesList}>
                                    {mockCategories.map(category => (
                                        <li
                                            key={category.id}
                                            className={`${styles.mainCategoryItem} ${activeCategoryId === category.id ? styles.active : ''}`}
                                            onMouseEnter={() => setActiveCategoryId(category.id)}
                                            onClick={() => handleCategoryOrSubcategorySelect(category, 'category')}
                                        >
                                            {category.name}
                                        </li>
                                    ))}
                                </ul>

                                <div className={styles.subcategoriesDisplay}>
                                    {activeCategoryId ? (
                                        <>
                                            <h3 className={styles.subcategoriesTitle}>
                                                {mockCategories.find(cat => cat.id === activeCategoryId)?.name}
                                            </h3>
                                            <ul className={styles.subcategoriesListGrid}>
                                                {filteredSubcategories.map(sub => (
                                                    <li key={sub.id}>
                                                        <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryOrSubcategorySelect(sub, 'subcategory'); }}>
                                                            {sub.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p className={styles.selectCategoryMessage}>Наведите на категорию слева</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Search;
